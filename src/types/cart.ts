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

export type CartDTO = {
  id: string;
  items: CartItemDTO[];
  itemCount: number;
  subtotal: number;
  isEmpty: boolean;
};
