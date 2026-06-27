import { z } from "zod";

export const MAX_CART_ITEM_QUANTITY = 99;

export const addToCartSchema = z.object({
  variantId: z.string().trim().min(1, "Variante requerida"),
  quantity: z.coerce
    .number()
    .int("Cantidad invalida")
    .min(1, "La cantidad minima es 1")
    .max(MAX_CART_ITEM_QUANTITY, "Cantidad maxima excedida"),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().trim().min(1, "Item requerido"),
  quantity: z.coerce
    .number()
    .int("Cantidad invalida")
    .min(0, "Cantidad invalida")
    .max(MAX_CART_ITEM_QUANTITY, "Cantidad maxima excedida"),
});

export const removeCartItemSchema = z.object({
  itemId: z.string().trim().min(1, "Item requerido"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
