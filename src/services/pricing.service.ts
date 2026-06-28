/**
 * Fuente unica de verdad para el precio efectivo de un producto.
 * Combina el descuento manual (discountPrice) con las promociones automaticas
 * activas (por categoria/coleccion/todo) y elige el mejor precio para el
 * cliente. Lo usan tanto el catalogo como el carrito/checkout para que el
 * precio mostrado y el cobrado coincidan.
 */

export type PricingPromotion = {
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  scope: "ALL" | "CATEGORY" | "COLLECTION";
  categoryId: string | null;
  collectionId: string | null;
};

export type PriceResult = {
  basePrice: number;
  price: number;
  hasDiscount: boolean;
  discountPercentage: number | null;
};

function promotionApplies(
  promo: PricingPromotion,
  categoryId: string,
  collectionIds: string[]
): boolean {
  switch (promo.scope) {
    case "ALL":
      return true;
    case "CATEGORY":
      return promo.categoryId !== null && promo.categoryId === categoryId;
    case "COLLECTION":
      return (
        promo.collectionId !== null && collectionIds.includes(promo.collectionId)
      );
    default:
      return false;
  }
}

function priceWithPromotion(basePrice: number, promo: PricingPromotion): number {
  if (promo.discountType === "PERCENTAGE") {
    return Math.max(0, Math.round(basePrice * (1 - promo.discountValue / 100)));
  }
  return Math.max(0, basePrice - promo.discountValue);
}

export function resolveProductPrice(input: {
  basePrice: number;
  discountPrice: number | null;
  categoryId: string;
  collectionIds: string[];
  promotions: PricingPromotion[];
}): PriceResult {
  const { basePrice } = input;

  // Punto de partida: descuento manual si es valido.
  let best =
    input.discountPrice !== null &&
    input.discountPrice > 0 &&
    input.discountPrice < basePrice
      ? input.discountPrice
      : basePrice;

  // Mejor promocion automatica aplicable (calculada sobre el precio base).
  for (const promo of input.promotions) {
    if (promotionApplies(promo, input.categoryId, input.collectionIds)) {
      const promoPrice = priceWithPromotion(basePrice, promo);
      if (promoPrice < best) {
        best = promoPrice;
      }
    }
  }

  const hasDiscount = best < basePrice;

  return {
    basePrice,
    price: best,
    hasDiscount,
    discountPercentage: hasDiscount
      ? Math.round(((basePrice - best) / basePrice) * 100)
      : null,
  };
}
