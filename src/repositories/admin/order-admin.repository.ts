import { OrderStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const adminOrderDetailInclude = {
  items: { orderBy: { createdAt: "asc" } },
  payments: { orderBy: { createdAt: "desc" } },
} satisfies Prisma.OrderInclude;

export type AdminOrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof adminOrderDetailInclude;
}>;

export const ADMIN_ORDERS_PAGE_SIZE = 20;

export function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { select: { quantity: true } } },
    take: limit,
  });
}

export function getAdminOrdersPage(params: { q?: string; page?: number } = {}) {
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const q = params.q?.trim();
  const where: Prisma.OrderWhereInput = q
    ? {
        OR: [
          { orderNumber: { contains: q } },
          { customerEmail: { contains: q } },
          { customerName: { contains: q } },
        ],
      }
    : {};

  return Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: { select: { quantity: true } } },
      skip: (page - 1) * ADMIN_ORDERS_PAGE_SIZE,
      take: ADMIN_ORDERS_PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);
}

export type AdminOrderListRow = Awaited<
  ReturnType<typeof getRecentOrders>
>[number];

export function getAdminOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: adminOrderDetailInclude,
  });
}

const PAID_OR_LATER: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

export async function getOrderMetrics() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [pendingPayment, paid, preparing, shipped, todaySales] =
    await Promise.all([
      prisma.order.count({ where: { status: OrderStatus.PENDING_PAYMENT } }),
      prisma.order.count({ where: { status: OrderStatus.PAID } }),
      prisma.order.count({ where: { status: OrderStatus.PREPARING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: { in: PAID_OR_LATER },
          createdAt: { gte: startOfDay },
        },
      }),
    ]);

  return {
    pendingPayment,
    paid,
    preparing,
    shipped,
    todaySales: todaySales._sum.total ? Number(todaySales._sum.total) : 0,
  };
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

export function updateOrderNotes(id: string, notes: string | null) {
  return prisma.order.update({
    where: { id },
    data: { notes },
  });
}
