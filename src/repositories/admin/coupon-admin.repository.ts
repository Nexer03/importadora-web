import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAdminCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { redemptions: true } } },
  });
}

export type AdminCouponRow = Awaited<ReturnType<typeof getAdminCoupons>>[number];

export function getAdminCouponById(id: string) {
  return prisma.coupon.findUnique({ where: { id } });
}

export function createCoupon(data: Prisma.CouponCreateInput) {
  return prisma.coupon.create({ data });
}

export function updateCoupon(id: string, data: Prisma.CouponUpdateInput) {
  return prisma.coupon.update({ where: { id }, data });
}

export function deactivateCoupon(id: string) {
  return prisma.coupon.update({
    where: { id },
    data: { isActive: false },
  });
}
