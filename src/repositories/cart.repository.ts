import { CartStatus, Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const cartWithItemsInclude = {
  items: {
    orderBy: { createdAt: "asc" },
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartWithItemsInclude;
}>;

export function getActiveCartBySession(sessionId: string) {
  return prisma.cart.findFirst({
    where: { sessionId, status: CartStatus.ACTIVE },
    include: cartWithItemsInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function createCart(sessionId: string, userId: string | null) {
  return prisma.cart.create({
    data: {
      sessionId,
      userId,
      status: CartStatus.ACTIVE,
    },
    include: cartWithItemsInclude,
  });
}

export function getCartById(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: cartWithItemsInclude,
  });
}

/**
 * Returns a sellable variant (active variant on a published product) or null.
 * Stock validation lives in the service layer.
 */
export function findSellableVariant(variantId: string) {
  return prisma.productVariant.findFirst({
    where: {
      id: variantId,
      isActive: true,
      product: {
        status: ProductStatus.PUBLISHED,
      },
    },
  });
}

export function getCartItem(cartId: string, itemId: string) {
  return prisma.cartItem.findFirst({
    where: { id: itemId, cartId },
    include: { productVariant: true },
  });
}

export function getCartItemByVariant(cartId: string, productVariantId: string) {
  return prisma.cartItem.findUnique({
    where: {
      cartId_productVariantId: { cartId, productVariantId },
    },
  });
}

export function createCartItem(
  cartId: string,
  productVariantId: string,
  quantity: number
) {
  return prisma.cartItem.create({
    data: { cartId, productVariantId, quantity },
  });
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

export function deleteCartItem(itemId: string) {
  return prisma.cartItem.delete({
    where: { id: itemId },
  });
}

export function touchCart(cartId: string) {
  return prisma.cart.update({
    where: { id: cartId },
    data: { updatedAt: new Date() },
  });
}
