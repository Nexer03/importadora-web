import {
  InvoiceStatus,
  OrderStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const adminOrderDetailInclude = {
  items: { orderBy: { createdAt: "asc" } },
  payments: { orderBy: { createdAt: "desc" } },
} satisfies Prisma.OrderInclude;

export type AdminOrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof adminOrderDetailInclude;
}>;

export function getAdminOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { select: { quantity: true } } },
    take: 100,
  });
}

export type AdminOrderListRow = Awaited<ReturnType<typeof getAdminOrders>>[number];

export function getAdminOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: adminOrderDetailInclude,
  });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

export function updateOrderShipping(
  id: string,
  carrier: string | null,
  trackingNumber: string | null
) {
  return prisma.order.update({
    where: { id },
    data: { carrier, trackingNumber },
  });
}

export function updateOrderInvoiceStatus(id: string, invoiceStatus: InvoiceStatus) {
  return prisma.order.update({
    where: { id },
    data: { invoiceStatus },
  });
}

export function updateOrderNotes(id: string, notes: string | null) {
  return prisma.order.update({
    where: { id },
    data: { notes },
  });
}
