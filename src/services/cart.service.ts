import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import {
  createCart,
  createCartItem,
  deleteCartItem,
  findSellableVariant,
  getActiveCartBySession,
  getCartItem,
  getCartItemByVariant,
  touchCart,
  updateCartItemQuantity,
  type CartWithItems,
} from "@/repositories/cart.repository";
import type { CartDTO, CartItemDTO } from "@/types/cart";
import {
  addToCartSchema,
  MAX_CART_ITEM_QUANTITY,
  removeCartItemSchema,
  updateCartItemSchema,
} from "@/validators/cart.validator";

const CART_COOKIE = "cart_session_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

/**
 * Error con mensaje seguro para mostrar al cliente.
 */
export class CartError extends Error {}

const EMPTY_CART: CartDTO = {
  id: "",
  items: [],
  itemCount: 0,
  subtotal: 0,
  isEmpty: true,
};

type DecimalLike = { toString(): string };

function toMoney(value: DecimalLike): number {
  return Number(value.toString());
}

function getEffectiveUnitPrice(
  item: CartWithItems["items"][number]
): number {
  const product = item.productVariant.product;
  const basePrice = toMoney(product.basePrice);
  const discountPrice = product.discountPrice
    ? toMoney(product.discountPrice)
    : null;

  const hasDiscount =
    discountPrice !== null && discountPrice > 0 && discountPrice < basePrice;
  const productPrice = hasDiscount ? discountPrice : basePrice;

  return item.productVariant.priceOverride
    ? toMoney(item.productVariant.priceOverride)
    : productPrice;
}

function toCartItemDTO(item: CartWithItems["items"][number]): CartItemDTO {
  const variant = item.productVariant;
  const product = variant.product;
  const unitPrice = getEffectiveUnitPrice(item);

  return {
    id: item.id,
    variantId: variant.id,
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    variantName: variant.name,
    sku: variant.sku,
    color: variant.color,
    size: variant.size,
    imageUrl: product.images[0]?.url ?? null,
    unitPrice,
    quantity: item.quantity,
    lineTotal: unitPrice * item.quantity,
    stockAvailable: Math.max(variant.stockAvailable, 0),
  };
}

function toCartDTO(cart: CartWithItems): CartDTO {
  const items = cart.items.map(toCartItemDTO);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  return {
    id: cart.id,
    items,
    itemCount,
    subtotal,
    isEmpty: items.length === 0,
  };
}

async function readCartSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

/**
 * Lee o crea el id de sesion del carrito. Solo debe llamarse desde Server
 * Actions o Route Handlers, ya que escribe la cookie.
 */
async function ensureCartSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const sessionId = randomUUID();
  store.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });

  return sessionId;
}

async function getSessionUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Resuelve el carrito activo creandolo si es necesario. Escribe cookie.
 */
async function resolveActiveCart(): Promise<CartWithItems> {
  const sessionId = await ensureCartSessionId();
  const existing = await getActiveCartBySession(sessionId);

  if (existing) {
    return existing;
  }

  const userId = await getSessionUserId();
  return createCart(sessionId, userId);
}

/**
 * Lectura de solo lectura del carrito. Seguro para Server Components: nunca
 * escribe cookie ni crea registros.
 */
export async function getCart(): Promise<CartDTO> {
  const sessionId = await readCartSessionId();

  if (!sessionId) {
    return EMPTY_CART;
  }

  const cart = await getActiveCartBySession(sessionId);
  return cart ? toCartDTO(cart) : EMPTY_CART;
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart.itemCount;
}

/**
 * Contexto del carrito activo para el checkout: id del carrito, sesion, usuario
 * (si lo hay) y los items ya mapeados a DTO (con precio unitario calculado).
 * Devuelve null si no hay carrito con items.
 */
export async function getCheckoutCart(): Promise<{
  cartId: string;
  sessionId: string;
  userId: string | null;
  items: CartItemDTO[];
  subtotal: number;
} | null> {
  const sessionId = await readCartSessionId();
  if (!sessionId) {
    return null;
  }

  const cart = await getActiveCartBySession(sessionId);
  if (!cart || cart.items.length === 0) {
    return null;
  }

  const dto = toCartDTO(cart);
  const userId = await getSessionUserId();

  return {
    cartId: cart.id,
    sessionId,
    userId,
    items: dto.items,
    subtotal: dto.subtotal,
  };
}

export async function addToCart(input: unknown): Promise<CartDTO> {
  const { variantId, quantity } = addToCartSchema.parse(input);

  const variant = await findSellableVariant(variantId);
  if (!variant) {
    throw new CartError("El producto no esta disponible.");
  }
  if (variant.stockAvailable <= 0) {
    throw new CartError("Producto agotado.");
  }

  const cart = await resolveActiveCart();
  const existingItem = await getCartItemByVariant(cart.id, variantId);
  const desiredQuantity = (existingItem?.quantity ?? 0) + quantity;
  const finalQuantity = Math.min(
    desiredQuantity,
    variant.stockAvailable,
    MAX_CART_ITEM_QUANTITY
  );

  if (existingItem) {
    await updateCartItemQuantity(existingItem.id, finalQuantity);
  } else {
    await createCartItem(cart.id, variantId, finalQuantity);
  }

  await touchCart(cart.id);
  return getCart();
}

export async function updateCartItem(input: unknown): Promise<CartDTO> {
  const { itemId, quantity } = updateCartItemSchema.parse(input);

  const sessionId = await readCartSessionId();
  if (!sessionId) {
    return EMPTY_CART;
  }

  const cart = await getActiveCartBySession(sessionId);
  if (!cart) {
    return EMPTY_CART;
  }

  const item = await getCartItem(cart.id, itemId);
  if (!item) {
    throw new CartError("El producto ya no esta en el carrito.");
  }

  if (quantity <= 0) {
    await deleteCartItem(item.id);
    await touchCart(cart.id);
    return getCart();
  }

  const finalQuantity = Math.min(
    quantity,
    item.productVariant.stockAvailable,
    MAX_CART_ITEM_QUANTITY
  );

  await updateCartItemQuantity(item.id, Math.max(finalQuantity, 1));
  await touchCart(cart.id);
  return getCart();
}

export async function removeCartItem(input: unknown): Promise<CartDTO> {
  const { itemId } = removeCartItemSchema.parse(input);

  const sessionId = await readCartSessionId();
  if (!sessionId) {
    return EMPTY_CART;
  }

  const cart = await getActiveCartBySession(sessionId);
  if (!cart) {
    return EMPTY_CART;
  }

  const item = await getCartItem(cart.id, itemId);
  if (item) {
    await deleteCartItem(item.id);
    await touchCart(cart.id);
  }

  return getCart();
}
