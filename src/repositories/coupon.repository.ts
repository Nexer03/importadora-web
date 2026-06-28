import { prisma } from "@/lib/prisma";

export function getCouponByCode(code: string) {
  return prisma.coupon.findUnique({ where: { code } });
}

export type CouponEntity = NonNullable<Awaited<ReturnType<typeof getCouponByCode>>>;
