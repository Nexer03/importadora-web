import {
  getCouponByCode,
  type CouponEntity,
} from "@/repositories/coupon.repository";

/**
 * Error con mensaje seguro para mostrar al cliente al aplicar un cupon.
 */
export class CouponError extends Error {}

export type AppliedCoupon = {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  /** Monto descontado del subtotal (0 para envio gratis). */
  discountAmount: number;
  freeShipping: boolean;
};

function toNumber(value: { toString(): string }): number {
  return Number(value.toString());
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

function computeApplied(coupon: CouponEntity, subtotal: number): AppliedCoupon {
  const value = toNumber(coupon.discountValue);

  if (coupon.discountType === "PERCENTAGE") {
    const discount = Math.min(Math.round((subtotal * value) / 100), subtotal);
    return {
      code: coupon.code,
      discountType: "PERCENTAGE",
      discountAmount: discount,
      freeShipping: false,
    };
  }

  if (coupon.discountType === "FIXED_AMOUNT") {
    const discount = Math.min(value, subtotal);
    return {
      code: coupon.code,
      discountType: "FIXED_AMOUNT",
      discountAmount: discount,
      freeShipping: false,
    };
  }

  return {
    code: coupon.code,
    discountType: "FREE_SHIPPING",
    discountAmount: 0,
    freeShipping: true,
  };
}

/**
 * Valida un codigo de cupon contra el subtotal. Lanza CouponError con un
 * mensaje claro si no es aplicable. La validacion y el calculo viven en
 * backend (regla del proyecto).
 */
export async function validateCoupon(
  rawCode: string,
  subtotal: number
): Promise<AppliedCoupon> {
  const code = normalizeCouponCode(rawCode);
  if (!code) {
    throw new CouponError("Ingresa un codigo de cupon.");
  }

  const coupon = await getCouponByCode(code);
  if (!coupon || !coupon.isActive) {
    throw new CouponError("Cupon no valido.");
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    throw new CouponError("Este cupon aun no esta vigente.");
  }
  if (coupon.endsAt && coupon.endsAt < now) {
    throw new CouponError("Este cupon ya expiro.");
  }
  if (coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses) {
    throw new CouponError("Este cupon alcanzo su limite de usos.");
  }

  const minPurchase = coupon.minPurchaseAmount
    ? toNumber(coupon.minPurchaseAmount)
    : 0;
  if (subtotal < minPurchase) {
    throw new CouponError(
      `Este cupon requiere una compra minima de $${minPurchase}.`
    );
  }

  return computeApplied(coupon, subtotal);
}

/**
 * Variante que no lanza: devuelve el cupon aplicado o null si ya no aplica.
 * Util para recalcular el carrito sin romper si el cupon expiro.
 */
export async function tryApplyCoupon(
  rawCode: string,
  subtotal: number
): Promise<AppliedCoupon | null> {
  try {
    return await validateCoupon(rawCode, subtotal);
  } catch {
    return null;
  }
}
