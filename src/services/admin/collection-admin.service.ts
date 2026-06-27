import type { CollectionInput } from "@/validators/admin/collection.validator";
import { collectionInputSchema } from "@/validators/admin/collection.validator";
import {
  attachProductToCollection,
  createCollection,
  deleteOrDeactivateCollection,
  detachProductFromCollection,
  getAdminCollectionById,
  getAdminCollections,
  updateCollection,
} from "@/repositories/admin/collection-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

import { normalizeSlug, validateAdminInput } from "./admin-service-utils";

export type AdminCollectionDTO = {
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

type CollectionWithCount = Awaited<
  ReturnType<typeof getAdminCollections>
>[number];

function mapCollection(collection: CollectionWithCount): AdminCollectionDTO {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    imageUrl: collection.imageUrl,
    isActive: collection.isActive,
    sortOrder: collection.sortOrder,
    seoTitle: collection.seoTitle,
    seoDescription: collection.seoDescription,
    seoKeywords: collection.seoKeywords,
    indexable: collection.indexable,
    ogImage: collection.ogImage,
    productsCount: collection._count.products,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

function mapCollectionData(data: CollectionInput) {
  return {
    ...data,
    slug: normalizeSlug(data.slug),
  };
}

export async function getAdminCollectionsList() {
  await requireAdminAccess();
  const collections = await getAdminCollections();
  return collections.map(mapCollection);
}

export async function getAdminCollectionDetail(id: string) {
  await requireAdminAccess();
  const collection = await getAdminCollectionById(id);
  return collection ? mapCollection(collection) : null;
}

export async function createAdminCollection(rawCollection: unknown) {
  await requireAdminAccess();
  const collection = validateAdminInput(collectionInputSchema, rawCollection);
  return createCollection(mapCollectionData(collection));
}

export async function updateAdminCollection(
  id: string,
  rawCollection: unknown
) {
  await requireAdminAccess();
  const collection = validateAdminInput(collectionInputSchema, rawCollection);
  return updateCollection(id, mapCollectionData(collection));
}

export async function deleteOrDeactivateAdminCollection(id: string) {
  await requireAdminAccess();
  return deleteOrDeactivateCollection(id);
}

export async function attachAdminProductToCollection(
  productId: string,
  collectionId: string
) {
  await requireAdminAccess();
  return attachProductToCollection(productId, collectionId);
}

export async function detachAdminProductFromCollection(
  productId: string,
  collectionId: string
) {
  await requireAdminAccess();
  return detachProductFromCollection(productId, collectionId);
}
