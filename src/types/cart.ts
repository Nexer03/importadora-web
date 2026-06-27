export type CartItemDTO = {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  color: string | null;
  size: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockAvailable: number;
};

export type CartCouponDTO = {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountAmount: number;
  freeShipping: boolean;
};

export type CartDTO = {
  id: string;
  items: CartItemDTO[];
  itemCount: number;
  subtotal: number;
  /** subtotal - descuento del cupon (sin envio, que se calcula en checkout). */
  total: number;
  coupon: CartCouponDTO | null;
  isEmpty: boolean;
};
