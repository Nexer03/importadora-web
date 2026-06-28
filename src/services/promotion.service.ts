import { getActivePromotions } from "@/repositories/promotion.repository";
import type { PricingPromotion } from "@/services/pricing.service";

/**
 * Promociones automaticas activas mapeadas al formato que usa el motor de
 * precios. Solo aplican descuentos de producto (porcentaje / monto fijo);
 * FREE_SHIPPING se ignora aqui (es a nivel de envio).
 */
export async function getActivePricingPromotions(): Promise<PricingPromotion[]> {
  const promotions = await getActivePromotions();

  return promotions
    .filter((promo) => promo.discountType !== "FREE_SHIPPING")
    .map((promo) => ({
      discountType: promo.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
      discountValue: Number(promo.discountValue.toString()),
      scope: promo.scope,
      categoryId: promo.categoryId,
      collectionId: promo.collectionId,
    }));
}
