import {
  CartStatus,
  DeliveryMethod,
  InventoryMovementType,
  InvoiceStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
  StockReservationStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

/**
 * Stock insuficiente detectado de forma atomica dentro de la transaccion.
 */
export class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`Stock insuficiente para ${productName}.`);
    this.name = "InsufficientStockError";
  }
}

export const orderWithItemsInclude = {
  items: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.OrderInclude;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: typeof orderWithItemsInclude;
}>;

export type CreatePendingOrderInput = {
  orderNumber: string;
  sessionId: string;
  userId: string | null;
  cartId: string;
  reservationExpiresAt: Date;
  paymentProvider: string;
  paymentReference: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: DeliveryMethod;
    shippingAddress: string | null;
    postalCode: string | null;
    city: string | null;
    state: string | null;
    addressReference: string | null;
  };
  invoice: {
    requires: boolean;
    rfc: string | null;
    name: string | null;
    postalCode: string | null;
    regime: string | null;
    cfdiUse: string | null;
    email: string | null;
  };
  couponCode: string | null;
  amounts: {
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    total: number;
  };
  items: Array<{
    productId: string;
    productVariantId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
};

/**
 * Crea una orden pending_payment reservando stock de forma atomica:
 * - decrementa stockAvailable / incrementa stockReserved con guarda condicional
 * - crea la orden con precios congelados
 * - crea reservas temporales y movimientos de inventario
 * - convierte el carrito
 *
 * Si algun item no tiene stock suficiente, lanza InsufficientStockError y la
 * transaccion completa hace rollback.
 */
export function createPendingOrder(
  input: CreatePendingOrderInput
): Promise<OrderWithItems> {
  return prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      const reserved = await tx.productVariant.updateMany({
        where: {
          id: item.productVariantId,
          stockAvailable: { gte: item.quantity },
        },
        data: {
          stockAvailable: { decrement: item.quantity },
          stockReserved: { increment: item.quantity },
        },
      });

      if (reserved.count !== 1) {
        throw new InsufficientStockError(item.productName);
      }
    }

    const order = await tx.order.create({
      data: {
        orderNumber: input.orderNumber,
        sessionId: input.sessionId,
        userId: input.userId,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        paymentProvider: input.paymentProvider,
        paymentReference: input.paymentReference,
        customerName: input.customer.name,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        deliveryMethod: input.delivery.method,
        shippingAddress: input.delivery.shippingAddress,
        postalCode: input.delivery.postalCode,
        city: input.delivery.city,
        state: input.delivery.state,
        addressReference: input.delivery.addressReference,
        invoiceStatus: input.invoice.requires
          ? InvoiceStatus.REQUESTED
          : InvoiceStatus.NOT_REQUESTED,
        fiscalRfc: input.invoice.rfc,
        fiscalName: input.invoice.name,
        fiscalPostalCode: input.invoice.postalCode,
        fiscalRegime: input.invoice.regime,
        fiscalCfdiUse: input.invoice.cfdiUse,
        fiscalEmail: input.invoice.email,
        subtotal: new Prisma.Decimal(input.amounts.subtotal),
        discountAmount: new Prisma.Decimal(input.amounts.discountAmount),
        couponCode: input.couponCode,
        shippingCost: new Prisma.Decimal(input.amounts.shippingCost),
        total: new Prisma.Decimal(input.amounts.total),
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            productVariantId: item.productVariantId,
            productName: item.productName,
            sku: item.sku,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            quantity: item.quantity,
            lineTotal: new Prisma.Decimal(item.lineTotal),
          })),
        },
      },
      include: orderWithItemsInclude,
    });

    for (const item of input.items) {
      await tx.stockReservation.create({
        data: {
          userId: input.userId,
          sessionId: input.sessionId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          status: StockReservationStatus.ACTIVE,
          expiresAt: input.reservationExpiresAt,
          orderId: order.id,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          productVariantId: item.productVariantId,
          userId: input.userId,
          type: InventoryMovementType.RESERVATION,
          quantity: -item.quantity,
          note: `Reserva por orden ${input.orderNumber}`,
        },
      });
    }

    await tx.cart.update({
      where: { id: input.cartId },
      data: { status: CartStatus.CONVERTED },
    });

    return order;
  });
}

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: orderWithItemsInclude,
  });
}

export function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { quantity: true } } },
    take: 50,
  });
}

/**
 * Expira reservas de stock vencidas (expiresAt pasado) de ordenes que siguen
 * pendientes de pago: libera el stock, marca las reservas EXPIRED y cancela la
 * orden. Idempotente. Pensada para ejecutarse por un cron. Devuelve el numero
 * de ordenes expiradas.
 */
export async function expireStaleReservations(
  now: Date = new Date()
): Promise<number> {
  const expired = await prisma.stockReservation.findMany({
    where: {
      status: StockReservationStatus.ACTIVE,
      expiresAt: { lt: now },
      orderId: { not: null },
    },
  });

  const byOrder = new Map<string, typeof expired>();
  for (const reservation of expired) {
    if (!reservation.orderId) {
      continue;
    }
    const group = byOrder.get(reservation.orderId) ?? [];
    group.push(reservation);
    byOrder.set(reservation.orderId, group);
  }

  let expiredOrders = 0;

  for (const [orderId, reservations] of byOrder) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.PENDING_PAYMENT) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      for (const reservation of reservations) {
        await tx.productVariant.update({
          where: { id: reservation.productVariantId },
          data: {
            stockAvailable: { increment: reservation.quantity },
            stockReserved: { decrement: reservation.quantity },
          },
        });
        await tx.inventoryMovement.create({
          data: {
            productVariantId: reservation.productVariantId,
            userId: order.userId,
            type: InventoryMovementType.RESERVATION_RELEASE,
            quantity: reservation.quantity,
            note: `Expiracion de reserva orden ${order.orderNumber}`,
          },
        });
      }

      await tx.stockReservation.updateMany({
        where: { orderId: order.id, status: StockReservationStatus.ACTIVE },
        data: { status: StockReservationStatus.EXPIRED },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.CANCELLED,
        },
      });
    });

    expiredOrders += 1;
  }

  return expiredOrders;
}

export function orderNumberExists(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true },
  });
}

export type PaymentRecord = {
  providerOrderId: string | null;
  captureId: string | null;
  payerEmail: string | null;
  raw: string;
  amount: number;
  currency: string;
};

/**
 * Marca la orden como pagada: convierte las reservas en venta, descuenta el
 * stock reservado del inventario fisico (movimiento SALE) y registra la
 * transaccion de pago. Todo atomico.
 */
export function markOrderPaid(orderId: string, payment: PaymentRecord) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new Error("Orden no encontrada al confirmar pago.");
    }

    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stockReserved: { decrement: item.quantity },
          stockTotal: { decrement: item.quantity },
        },
      });
      await tx.inventoryMovement.create({
        data: {
          productVariantId: item.productVariantId,
          userId: order.userId,
          type: InventoryMovementType.SALE,
          quantity: -item.quantity,
          note: `Venta confirmada orden ${order.orderNumber}`,
        },
      });
    }

    await tx.stockReservation.updateMany({
      where: { orderId: order.id, status: StockReservationStatus.ACTIVE },
      data: { status: StockReservationStatus.CONVERTED },
    });

    if (order.couponCode) {
      const coupon = await tx.coupon.findUnique({
        where: { code: order.couponCode },
      });
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usesCount: { increment: 1 } },
        });
        await tx.couponRedemption.create({
          data: { couponId: coupon.id, orderId: order.id },
        });
      }
    }

    await tx.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: order.paymentProvider ?? "paypal",
        providerOrderId: payment.providerOrderId,
        providerCaptureId: payment.captureId,
        status: "COMPLETED",
        amount: new Prisma.Decimal(payment.amount),
        currency: payment.currency,
        payerEmail: payment.payerEmail,
        rawResponse: payment.raw,
      },
    });

    return tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.APPROVED,
      },
      include: orderWithItemsInclude,
    });
  });
}

/**
 * Libera el stock reservado de una orden (devuelve a disponible) y cancela sus
 * reservas. Uso comun para pago fallido o cancelado.
 */
async function releaseOrderStock(
  tx: Prisma.TransactionClient,
  order: OrderWithItems
) {
  for (const item of order.items) {
    await tx.productVariant.update({
      where: { id: item.productVariantId },
      data: {
        stockAvailable: { increment: item.quantity },
        stockReserved: { decrement: item.quantity },
      },
    });
    await tx.inventoryMovement.create({
      data: {
        productVariantId: item.productVariantId,
        userId: order.userId,
        type: InventoryMovementType.RESERVATION_RELEASE,
        quantity: item.quantity,
        note: `Liberacion de reserva orden ${order.orderNumber}`,
      },
    });
  }

  await tx.stockReservation.updateMany({
    where: { orderId: order.id, status: StockReservationStatus.ACTIVE },
    data: { status: StockReservationStatus.CANCELLED },
  });
}

export function markOrderPaymentFailed(
  orderId: string,
  payment: PaymentRecord & { status: string }
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: orderWithItemsInclude,
    });
    if (!order) {
      throw new Error("Orden no encontrada al marcar pago fallido.");
    }

    await releaseOrderStock(tx, order);

    await tx.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: order.paymentProvider ?? "paypal",
        providerOrderId: payment.providerOrderId,
        providerCaptureId: payment.captureId,
        status: payment.status,
        amount: new Prisma.Decimal(payment.amount),
        currency: payment.currency,
        payerEmail: payment.payerEmail,
        rawResponse: payment.raw,
      },
    });

    return tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAYMENT_FAILED,
        paymentStatus: PaymentStatus.REJECTED,
      },
    });
  });
}

/**
 * Cancela una orden pendiente, libera su stock y recrea un carrito activo con
 * los mismos items para que el cliente no pierda su seleccion.
 */
export function cancelOrderAndRestoreCart(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: orderWithItemsInclude,
    });
    if (!order) {
      throw new Error("Orden no encontrada al cancelar.");
    }

    await releaseOrderStock(tx, order);

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED,
      },
    });

    if (order.sessionId) {
      await tx.cart.create({
        data: {
          sessionId: order.sessionId,
          userId: order.userId,
          status: CartStatus.ACTIVE,
          items: {
            create: order.items.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            })),
          },
        },
      });
    }

    return order;
  });
}
