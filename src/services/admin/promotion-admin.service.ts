import { getActiveCategories } from "@/repositories/category.repository";
import { getActiveCollections } from "@/repositories/collection.repository";
import {
  createPromotion,
  deactivatePromotion,
  getAdminPromotionById,
  getAdminPromotions,
  updatePromotion,
  type AdminPromotionRow,
} from "@/repositories/admin/promotion-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";
import {
  promotionInputSchema,
  type PromotionInput,
} from "@/validators/admin/promotion.validator";

import { decimalToNumber, validateAdminInput } from "./admin-service-utils";

export type AdminPromotionDTO = {
  id: string;
  name: string;
  discountType: string;
  discountValue: number;
  scope: string;
  categoryId: string | null;
  collectionId: string | null;
  categoryName: string | null;
  collectionName: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

function mapPromotion(promo: AdminPromotionRow): AdminPromotionDTO {
  return {
    id: promo.id,
    name: promo.name,
    discountType: promo.discountType,
    discountValue: decimalToNumber(promo.discountValue),
    scope: promo.scope,
    categoryId: promo.categoryId,
    collectionId: promo.collectionId,
    categoryName: promo.category?.name ?? null,
    collectionName: promo.collection?.name ?? null,
    startsAt: promo.startsAt,
    endsAt: promo.endsAt,
    isActive: promo.isActive,
  };
}

function mapPromotionData(input: PromotionInput) {
  return {
    name: input.name,
    discountType: input.discountType,
    discountValue: input.discountValue,
    scope: input.scope,
    categoryId:
      input.scope === "CATEGORY" ? input.categoryId || null : null,
    collectionId:
      input.scope === "COLLECTION" ? input.collectionId || null : null,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
    isActive: input.isActive,
  };
}

export async function getAdminPromotionsList() {
  await requireAdminAccess();
  const promotions = await getAdminPromotions();
  return promotions.map(mapPromotion);
}

export async function getAdminPromotionDetail(id: string) {
  await requireAdminAccess();
  const promo = await getAdminPromotionById(id);
  return promo ? mapPromotion(promo) : null;
}

/** Categorias y colecciones activas para los selects del formulario. */
export async function getPromotionTargets() {
  await requireAdminAccess();
  const [categories, collections] = await Promise.all([
    getActiveCategories(),
    getActiveCollections(),
  ]);
  return {
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
    collections: collections.map((c) => ({ id: c.id, name: c.name })),
  };
}

export async function createAdminPromotion(raw: unknown) {
  await requireAdminAccess();
  const input = validateAdminInput(promotionInputSchema, raw);
  return createPromotion(mapPromotionData(input));
}

export async function updateAdminPromotion(id: string, raw: unknown) {
  await requireAdminAccess();
  const input = validateAdminInput(promotionInputSchema, raw);
  return updatePromotion(id, mapPromotionData(input));
}

export async function deactivateAdminPromotion(id: string) {
  await requireAdminAccess();
  return deactivatePromotion(id);
}
