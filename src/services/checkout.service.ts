import { randomInt } from "node:crypto";

import { DeliveryMethod } from "@prisma/client";

import {
  createPendingOrder,
  getOrderByNumber,
  InsufficientStockError,
  orderNumberExists,
  type OrderWithItems,
} from "@/repositories/order.repository";
import { getCheckoutCart } from "@/services/cart.service";
import { tryApplyCoupon } from "@/services/coupon.service";
import {
  getPaymentProvider,
  getStoreCurrency,
  isPaymentMethodAvailable,
} from "@/services/payments/registry";
import { PaymentError } from "@/services/payments/provider";
import { calculateShippingCost } from "@/services/shipping.service";
import type { OrderDTO } from "@/types/order";
import { checkoutSchema } from "@/validators/checkout.validator";

function getAppUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}

const RESERVATION_MINUTES = 15;

/**
 * Error con mensaje seguro para mostrar al cliente en el checkout.
 */
export class CheckoutError extends Error {}

type DecimalLike = { toString(): string };

function toMoney(value: DecimalLike): number {
  return Number(value.toString());
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pad(value: number, length: number): string {
  return value.toString().padStart(length, "0");
}

function buildOrderNumber(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(
    now.getDate(),
    2
  )}`;
  const randomPart = pad(randomInt(0, 100000), 5);
  return `IMP-${datePart}-${randomPart}`;
}

async function generateUniqueOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = buildOrderNumber();
    const existing = await orderNumberExists(candidate);
    if (!existing) {
      return candidate;
    }
  }
  throw new CheckoutError("No se pudo generar el numero de orden. Intenta de nuevo.");
}

export function toOrderDTO(order: OrderWithItems): OrderDTO {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryMethod: order.deliveryMethod,
    shippingAddress: order.shippingAddress,
    postalCode: order.postalCode,
    city: order.city,
    state: order.state,
    addressReference: order.addressReference,
    invoiceStatus: order.invoiceStatus,
    subtotal: toMoney(order.subtotal),
    discountAmount: toMoney(order.discountAmount),
    couponCode: order.couponCode,
    shippingCost: toMoney(order.shippingCost),
    total: toMoney(order.total),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      unitPrice: toMoney(item.unitPrice),
      quantity: item.quantity,
      lineTotal: toMoney(item.lineTotal),
    })),
    createdAt: order.createdAt.toISOString(),
  };
}

/**
 * Crea una orden pending_payment a partir del carrito activo y arranca el pago
 * con PayPal. Todos los montos (subtotal, envio, total) se calculan en backend.
 * El stock se reserva de forma atomica. Devuelve la URL de aprobacion de PayPal.
 *
 * Orden de operaciones: primero se crea la orden de PayPal (si falla, el
 * carrito permanece intacto); luego se crea la orden interna y se reserva stock.
 */
export async function createOrderFromCart(
  input: unknown
): Promise<{ orderNumber: string; approveUrl: string }> {
  const data = checkoutSchema.parse(input);

  const checkoutCart = await getCheckoutCart();
  if (!checkoutCart) {
    throw new CheckoutError("Tu carrito esta vacio.");
  }

  const subtotal = checkoutCart.subtotal;

  let discountAmount = 0;
  let freeShipping = false;
  let couponCode: string | null = null;
  if (checkoutCart.couponCode) {
    const applied = await tryApplyCoupon(checkoutCart.couponCode, subtotal);
    if (applied) {
      discountAmount = applied.discountAmount;
      freeShipping = applied.freeShipping;
      couponCode = applied.code;
    }
  }

  const shippingCost = freeShipping
    ? 0
    : await calculateShippingCost(data.deliveryMethod, subtotal);
  const total = subtotal - discountAmount + shippingCost;

  const orderNumber = await generateUniqueOrderNumber();
  const reservationExpiresAt = new Date(
    Date.now() + RESERVATION_MINUTES * 60 * 1000
  );

  if (!isPaymentMethodAvailable(data.paymentProvider)) {
    throw new CheckoutError("Metodo de pago no disponible.");
  }

  const appUrl = getAppUrl();
  const provider = getPaymentProvider(data.paymentProvider);
  let payment;
  try {
    payment = await provider.createPayment({
      orderNumber,
      amount: total,
      currency: getStoreCurrency(),
      description: `Pedido ${orderNumber} - Importadora`,
      returnUrl: `${appUrl}/api/payments/${provider.name}/capture?order=${orderNumber}`,
      cancelUrl: `${appUrl}/api/payments/${provider.name}/cancel?order=${orderNumber}`,
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      throw new CheckoutError(
        "No se pudo iniciar el pago. Intenta de nuevo."
      );
    }
    throw error;
  }

  try {
    await createPendingOrder({
      orderNumber,
      sessionId: checkoutCart.sessionId,
      userId: checkoutCart.userId,
      cartId: checkoutCart.cartId,
      reservationExpiresAt,
      paymentProvider: provider.name,
      paymentReference: payment.reference,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      delivery: {
        method: data.deliveryMethod as DeliveryMethod,
        shippingAddress: emptyToNull(data.shippingAddress),
        postalCode: emptyToNull(data.postalCode),
        city: emptyToNull(data.city),
        state: emptyToNull(data.state),
        addressReference: emptyToNull(data.addressReference),
      },
      invoice: {
        requires: data.requiresInvoice,
        rfc: emptyToNull(data.fiscalRfc),
        name: emptyToNull(data.fiscalName),
        postalCode: emptyToNull(data.fiscalPostalCode),
        regime: emptyToNull(data.fiscalRegime),
        cfdiUse: emptyToNull(data.fiscalCfdiUse),
        email: emptyToNull(data.fiscalEmail),
      },
      amounts: { subtotal, discountAmount, shippingCost, total },
      couponCode,
      items: checkoutCart.items.map((item) => ({
        productId: item.productId,
        productVariantId: item.variantId,
        productName: item.productName,
        sku: item.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    });

    return { orderNumber, approveUrl: payment.redirectUrl };
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      throw new CheckoutError(
        `${error.productName} ya no tiene stock suficiente. Ajusta tu carrito.`
      );
    }
    throw error;
  }
}

export async function getOrderDetail(
  orderNumber: string
): Promise<OrderDTO | null> {
  const order = await getOrderByNumber(orderNumber);
  return order ? toOrderDTO(order) : null;
}
