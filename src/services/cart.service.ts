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
  setCartCoupon,
  touchCart,
  updateCartItemQuantity,
  type CartWithItems,
} from "@/repositories/cart.repository";
import { getOrderByNumber } from "@/repositories/order.repository";
import { tryApplyCoupon, validateCoupon } from "@/services/coupon.service";
import {
  resolveProductPrice,
  type PricingPromotion,
} from "@/services/pricing.service";
import { getActivePricingPromotions } from "@/services/promotion.service";
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
  total: 0,
  coupon: null,
  isEmpty: true,
};

type DecimalLike = { toString(): string };

function toMoney(value: DecimalLike): number {
  return Number(value.toString());
}

function getEffectiveUnitPrice(
  item: CartWithItems["items"][number],
  promotions: PricingPromotion[]
): number {
  const variant = item.productVariant;
  const product = variant.product;

  // Un precio explicito de variante manda sobre las promociones de producto.
  if (variant.priceOverride) {
    return toMoney(variant.priceOverride);
  }

  const basePrice = toMoney(product.basePrice);
  const discountPrice = product.discountPrice
    ? toMoney(product.discountPrice)
    : null;
  const collectionIds = product.collections.map((c) => c.collectionId);

  return resolveProductPrice({
    basePrice,
    discountPrice,
    categoryId: product.categoryId,
    collectionIds,
    promotions,
  }).price;
}

function toCartItemDTO(
  item: CartWithItems["items"][number],
  promotions: PricingPromotion[]
): CartItemDTO {
  const variant = item.productVariant;
  const product = variant.product;
  const unitPrice = getEffectiveUnitPrice(item, promotions);

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

async function toCartDTO(cart: CartWithItems): Promise<CartDTO> {
  const promotions = await getActivePricingPromotions();
  const items = cart.items.map((item) => toCartItemDTO(item, promotions));
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  const applied = cart.couponCode
    ? await tryApplyCoupon(cart.couponCode, subtotal)
    : null;
  const coupon = applied
    ? {
        code: applied.code,
        discountType: applied.discountType,
        discountAmount: applied.discountAmount,
        freeShipping: applied.freeShipping,
      }
    : null;
  const total = subtotal - (coupon?.discountAmount ?? 0);

  return {
    id: cart.id,
    items,
    itemCount,
    subtotal,
    total,
    coupon,
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

export async function applyCartCoupon(rawCode: string): Promise<CartDTO> {
  const sessionId = await readCartSessionId();
  if (!sessionId) {
    throw new CartError("Tu carrito esta vacio.");
  }
  const cart = await getActiveCartBySession(sessionId);
  if (!cart || cart.items.length === 0) {
    throw new CartError("Tu carrito esta vacio.");
  }

  const promotions = await getActivePricingPromotions();
  const subtotal = cart.items.reduce(
    (total, item) =>
      total + getEffectiveUnitPrice(item, promotions) * item.quantity,
    0
  );

  // Lanza CouponError si el cupon no es valido para este subtotal.
  const applied = await validateCoupon(rawCode, subtotal);
  await setCartCoupon(cart.id, applied.code);
  return getCart();
}

export async function removeCartCoupon(): Promise<CartDTO> {
  const sessionId = await readCartSessionId();
  if (!sessionId) {
    return EMPTY_CART;
  }
  const cart = await getActiveCartBySession(sessionId);
  if (cart) {
    await setCartCoupon(cart.id, null);
  }
  return getCart();
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
  couponCode: string | null;
} | null> {
  const sessionId = await readCartSessionId();
  if (!sessionId) {
    return null;
  }

  const cart = await getActiveCartBySession(sessionId);
  if (!cart || cart.items.length === 0) {
    return null;
  }

  const dto = await toCartDTO(cart);
  const userId = await getSessionUserId();

  return {
    cartId: cart.id,
    sessionId,
    userId,
    items: dto.items,
    subtotal: dto.subtotal,
    couponCode: cart.couponCode,
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

/**
 * Vuelve a agregar al carrito los productos de un pedido previo. Los items que
 * ya no esten disponibles (variante inactiva, agotada) se omiten.
 */
export async function reorderToCart(
  orderNumber: string
): Promise<{ added: number; skipped: number }> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return { added: 0, skipped: 0 };
  }

  let added = 0;
  let skipped = 0;
  for (const item of order.items) {
    try {
      await addToCart({
        variantId: item.productVariantId,
        quantity: item.quantity,
      });
      added += 1;
    } catch {
      skipped += 1;
    }
  }

  return { added, skipped };
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
