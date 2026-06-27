"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addToCart,
  CartError,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";

export type CartActionState = {
  ok: boolean;
  error?: string;
  /** timestamp del ultimo exito, util para feedback en cliente */
  updatedAt?: number;
};

const GENERIC_ERROR = "No se pudo actualizar el carrito.";

function toErrorMessage(error: unknown): string {
  if (error instanceof CartError) {
    return error.message;
  }
  return GENERIC_ERROR;
}

function revalidateCart() {
  // "layout" revalida el header (contador) y la pagina de carrito a la vez.
  revalidatePath("/", "layout");
}

export async function addToCartAction(
  _prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  try {
    await addToCart({
      variantId: formData.get("variantId"),
      quantity: formData.get("quantity") ?? 1,
    });
    revalidateCart();
    return { ok: true, updatedAt: Date.now() };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function buyNowAction(formData: FormData): Promise<void> {
  await addToCart({
    variantId: formData.get("variantId"),
    quantity: formData.get("quantity") ?? 1,
  });
  revalidateCart();
  redirect("/carrito");
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  try {
    await updateCartItem({
      itemId: formData.get("itemId"),
      quantity: formData.get("quantity"),
    });
  } catch {
    // El carrito se revalida igual; un item inexistente no debe romper la UI.
  }
  revalidateCart();
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  try {
    await removeCartItem({ itemId: formData.get("itemId") });
  } catch {
    // idem: remover algo ya removido es no-op para la UI.
  }
  revalidateCart();
}
