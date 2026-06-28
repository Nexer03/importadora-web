import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const promotionAdminInclude = {
  category: { select: { name: true } },
  collection: { select: { name: true } },
} satisfies Prisma.PromotionInclude;

export type AdminPromotionRow = Prisma.PromotionGetPayload<{
  include: typeof promotionAdminInclude;
}>;

export function getAdminPromotions() {
  return prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
    include: promotionAdminInclude,
  });
}

export function getAdminPromotionById(id: string) {
  return prisma.promotion.findUnique({
    where: { id },
    include: promotionAdminInclude,
  });
}

export type PromotionData = {
  name: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  scope: "ALL" | "CATEGORY" | "COLLECTION";
  categoryId: string | null;
  collectionId: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

export function createPromotion(data: PromotionData) {
  return prisma.promotion.create({ data });
}

export function updatePromotion(id: string, data: PromotionData) {
  return prisma.promotion.update({ where: { id }, data });
}

export function deactivatePromotion(id: string) {
  return prisma.promotion.update({
    where: { id },
    data: { isActive: false },
  });
}
