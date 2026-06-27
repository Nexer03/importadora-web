import type { CategoryInput } from "@/validators/admin/category.validator";
import { categoryInputSchema } from "@/validators/admin/category.validator";
import {
  createCategory,
  deleteOrDeactivateCategory,
  getAdminCategories,
  getAdminCategoryById,
  updateCategory,
} from "@/repositories/admin/category-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

import { normalizeSlug, validateAdminInput } from "./admin-service-utils";

export type AdminCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  indexable: boolean;
  ogImage: string | null;
  productsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryWithCount = Awaited<ReturnType<typeof getAdminCategories>>[number];

function mapCategory(category: CategoryWithCount): AdminCategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    seoTitle: category.seoTitle,
    seoDescription: category.seoDescription,
    seoKeywords: category.seoKeywords,
    indexable: category.indexable,
    ogImage: category.ogImage,
    productsCount: category._count.products,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function mapCategoryData(data: CategoryInput) {
  return {
    ...data,
    slug: normalizeSlug(data.slug),
  };
}

export async function getAdminCategoriesList() {
  await requireAdminAccess();
  const categories = await getAdminCategories();
  return categories.map(mapCategory);
}

export async function getAdminCategoryDetail(id: string) {
  await requireAdminAccess();
  const category = await getAdminCategoryById(id);
  return category ? mapCategory(category) : null;
}

export async function createAdminCategory(rawCategory: unknown) {
  await requireAdminAccess();
  const category = validateAdminInput(categoryInputSchema, rawCategory);
  return createCategory(mapCategoryData(category));
}

export async function updateAdminCategory(id: string, rawCategory: unknown) {
  await requireAdminAccess();
  const category = validateAdminInput(categoryInputSchema, rawCategory);
  return updateCategory(id, mapCategoryData(category));
}

export async function deleteOrDeactivateAdminCategory(id: string) {
  await requireAdminAccess();
  return deleteOrDeactivateCategory(id);
}
