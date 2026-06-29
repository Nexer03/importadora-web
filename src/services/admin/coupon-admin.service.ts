import {
  createCoupon,
  deactivateCoupon,
  getAdminCouponById,
  getAdminCoupons,
  updateCoupon,
  type AdminCouponRow,
} from "@/repositories/admin/coupon-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";
import { logAdminAction } from "@/services/admin/audit-admin.service";
import { normalizeCouponCode } from "@/services/coupon.service";
import {
  couponInputSchema,
  type CouponInput,
} from "@/validators/admin/coupon.validator";

import { decimalToNumber, validateAdminInput } from "./admin-service-utils";

export type AdminCouponDTO = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minPurchaseAmount: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  maxUses: number | null;
  usesCount: number;
  isActive: boolean;
  redemptionsCount: number;
  createdAt: Date;
};

function mapCoupon(coupon: AdminCouponRow): AdminCouponDTO {
  return {
    id: coupon.id,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: decimalToNumber(coupon.discountValue),
    minPurchaseAmount: coupon.minPurchaseAmount
      ? decimalToNumber(coupon.minPurchaseAmount)
      : null,
    startsAt: coupon.startsAt,
    endsAt: coupon.endsAt,
    maxUses: coupon.maxUses,
    usesCount: coupon.usesCount,
    isActive: coupon.isActive,
    redemptionsCount: coupon._count.redemptions,
    createdAt: coupon.createdAt,
  };
}

function mapCouponData(input: CouponInput) {
  return {
    code: normalizeCouponCode(input.code),
    description: input.description?.trim() ? input.description.trim() : null,
    discountType: input.discountType,
    discountValue: input.discountValue,
    minPurchaseAmount: input.minPurchaseAmount ?? null,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
    maxUses: input.maxUses ?? null,
    isActive: input.isActive,
  };
}

export async function getAdminCouponsList() {
  await requireAdminAccess();
  const coupons = await getAdminCoupons();
  return coupons.map(mapCoupon);
}

export async function getAdminCouponDetail(id: string) {
  await requireAdminAccess();
  const coupon = await getAdminCouponById(id);
  if (!coupon) {
    return null;
  }
  return mapCoupon({ ...coupon, _count: { redemptions: 0 } });
}

export async function createAdminCoupon(raw: unknown) {
  const admin = await requireAdminAccess();
  const input = validateAdminInput(couponInputSchema, raw);
  const coupon = await createCoupon(mapCouponData(input));
  await logAdminAction(admin.id, "Cupon creado", {
    entity: "coupon",
    entityId: coupon.id,
    detail: coupon.code,
  });
  return coupon;
}

export async function updateAdminCoupon(id: string, raw: unknown) {
  await requireAdminAccess();
  const input = validateAdminInput(couponInputSchema, raw);
  return updateCoupon(id, mapCouponData(input));
}

export async function deactivateAdminCoupon(id: string) {
  await requireAdminAccess();
  return deactivateCoupon(id);
}
