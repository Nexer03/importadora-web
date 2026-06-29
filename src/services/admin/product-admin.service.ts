import { ProductStatus } from "@prisma/client";

import { requireAdminAccess } from "@/services/admin.guard";
import type {
  DefaultProductVariantInput,
  ProductImageInput,
  ProductInput,
  ProductVariantInput,
} from "@/validators/admin/product.validator";
import {
  defaultProductVariantInputSchema,
  productImageInputSchema,
  productInputSchema,
  productVariantInputSchema,
} from "@/validators/admin/product.validator";
import {
  countActiveCategories,
  getAdminCategories,
} from "@/repositories/admin/category-admin.repository";
import {
  countActiveCollections,
  getAdminCollections,
} from "@/repositories/admin/collection-admin.repository";
import { getAdminAudiences } from "@/repositories/admin/audience-admin.repository";
import {
  archiveProduct,
  createProductImage,
  createProductVariant,
  createProductWithVariant,
  deleteProductImage,
  deleteProductVariant,
  ADMIN_PRODUCTS_PAGE_SIZE,
  getAdminProductById,
  getAdminProductsPage,
  getAdminProductStatusCounts,
  getLatestAdminProducts,
  setPrimaryProductImage,
  updateProduct,
  updateProductImage,
  updateProductVariant,
  type AdminProductWithRelations,
} from "@/repositories/admin/product-admin.repository";

import {
  decimalToNumber,
  normalizeSlug,
  validateAdminInput,
} from "./admin-service-utils";

export type AdminProductDTO = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  status: ProductStatus;
  basePrice: number;
  discountPrice: number | null;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  audienceId: string;
  categoryName: string;
  categorySlug: string;
  audienceName: string;
  audienceSlug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  indexable: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  stockAvailable: number;
  variants: AdminProductVariantDTO[];
  images: AdminProductImageDTO[];
  collections: AdminProductCollectionDTO[];
};

export type AdminProductVariantDTO = {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  priceOverride: number | null;
  stockTotal: number;
  stockAvailable: number;
  stockReserved: number;
  isActive: boolean;
};

export type AdminProductImageDTO = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type AdminProductCollectionDTO = {
  id: string;
  name: string;
  slug: string;
};

function mapVariant(
  variant: AdminProductWithRelations["variants"][number]
): AdminProductVariantDTO {
  return {
    id: variant.id,
    sku: variant.sku,
    name: variant.name,
    color: variant.color,
    size: variant.size,
    priceOverride: variant.priceOverride
      ? decimalToNumber(variant.priceOverride)
      : null,
    stockTotal: variant.stockTotal,
    stockAvailable: variant.stockAvailable,
    stockReserved: variant.stockReserved,
    isActive: variant.isActive,
  };
}

function mapProduct(product: AdminProductWithRelations): AdminProductDTO {
  const stockAvailable = product.variants.reduce(
    (total, variant) => total + Math.max(variant.stockAvailable, 0),
    0
  );

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    status: product.status,
    basePrice: decimalToNumber(product.basePrice),
    discountPrice: product.discountPrice
      ? decimalToNumber(product.discountPrice)
      : null,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    categoryId: product.categoryId,
    audienceId: product.audienceId,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    audienceName: product.audience.name,
    audienceSlug: product.audience.slug,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    seoKeywords: product.seoKeywords,
    canonicalUrl: product.canonicalUrl,
    ogTitle: product.ogTitle,
    ogDescription: product.ogDescription,
    ogImage: product.ogImage,
    indexable: product.indexable,
    publishedAt: product.publishedAt,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    stockAvailable,
    variants: product.variants.map(mapVariant),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    })),
    collections: product.collections.map((item) => ({
      id: item.collection.id,
      name: item.collection.name,
      slug: item.collection.slug,
    })),
  };
}

function mapProductData(data: ProductInput) {
  const status = data.status as ProductStatus;

  return {
    name: data.name,
    slug: normalizeSlug(data.slug),
    shortDescription: data.shortDescription,
    description: data.description,
    basePrice: data.basePrice,
    discountPrice: data.discountPrice,
    status,
    categoryId: data.categoryId,
    audienceId: data.audienceId,
    isFeatured: data.isFeatured,
    isNew: data.isNew,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoKeywords: data.seoKeywords,
    canonicalUrl: data.canonicalUrl,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    ogImage: data.ogImage,
    indexable: data.indexable,
    publishedAt: status === ProductStatus.PUBLISHED ? new Date() : null,
  };
}

function mapVariantData(data: ProductVariantInput) {
  return {
    sku: data.sku,
    name: data.name,
    color: data.color,
    size: data.size,
    priceOverride: data.priceOverride,
    stockTotal: data.stockTotal,
    stockAvailable: data.stockAvailable,
    stockReserved: data.stockReserved,
    isActive: data.isActive,
  };
}

function mapDefaultVariantData(data: DefaultProductVariantInput) {
  return {
    sku: data.sku,
    name: data.name,
    color: null,
    size: null,
    priceOverride: null,
    stockTotal: data.stockTotal,
    stockAvailable: data.stockAvailable,
    stockReserved: 0,
    isActive: true,
  };
}

function mapImageData(data: ProductImageInput) {
  return {
    url: data.url,
    altText: data.altText,
    sortOrder: data.sortOrder,
    isPrimary: data.isPrimary,
  };
}

export async function getAdminProductsList(
  params: { q?: string; page?: number } = {}
) {
  await requireAdminAccess();
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const [products, total] = await getAdminProductsPage({ q: params.q, page });
  return {
    products: products.map(mapProduct),
    total,
    page,
    pageSize: ADMIN_PRODUCTS_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PRODUCTS_PAGE_SIZE)),
  };
}

export async function getAdminProductDetail(id: string) {
  await requireAdminAccess();
  const product = await getAdminProductById(id);
  return product ? mapProduct(product) : null;
}

export async function getAdminProductFormOptions() {
  await requireAdminAccess();
  const [categories, audiences, collections] = await Promise.all([
    getAdminCategories(),
    getAdminAudiences(),
    getAdminCollections(),
  ]);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    })),
    audiences: audiences.map((audience) => ({
      id: audience.id,
      name: audience.name,
      slug: audience.slug,
      isActive: audience.isActive,
    })),
    collections: collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      isActive: collection.isActive,
    })),
  };
}

export async function getAdminDashboardData() {
  await requireAdminAccess();
  const [stats, activeCategories, activeCollections, latestProducts] =
    await Promise.all([
      getAdminProductStatusCounts(),
      countActiveCategories(),
      countActiveCollections(),
      getLatestAdminProducts(6),
    ]);

  return {
    stats: {
      ...stats,
      activeCategories,
      activeCollections,
    },
    latestProducts: latestProducts.map(mapProduct),
  };
}

export async function createAdminProduct(
  rawProduct: unknown,
  rawDefaultVariant: unknown
) {
  await requireAdminAccess();
  const product = validateAdminInput(productInputSchema, rawProduct);
  const variant = validateAdminInput(
    defaultProductVariantInputSchema,
    rawDefaultVariant
  );

  const created = await createProductWithVariant(
    mapProductData(product),
    mapDefaultVariantData(variant)
  );

  return mapProduct(created);
}

export async function updateAdminProduct(id: string, rawProduct: unknown) {
  await requireAdminAccess();
  const product = validateAdminInput(productInputSchema, rawProduct);
  const updated = await updateProduct(id, mapProductData(product));
  return mapProduct(updated);
}

export async function archiveAdminProduct(id: string) {
  await requireAdminAccess();
  const product = await archiveProduct(id);
  return mapProduct(product);
}

export async function createAdminProductVariant(
  productId: string,
  rawVariant: unknown
) {
  await requireAdminAccess();
  const variant = validateAdminInput(productVariantInputSchema, rawVariant);
  return createProductVariant(productId, mapVariantData(variant));
}

export async function updateAdminProductVariant(
  id: string,
  rawVariant: unknown
) {
  await requireAdminAccess();
  const variant = validateAdminInput(productVariantInputSchema, rawVariant);
  return updateProductVariant(id, mapVariantData(variant));
}

export async function deleteAdminProductVariant(id: string) {
  await requireAdminAccess();
  return deleteProductVariant(id);
}

export async function createAdminProductImage(
  productId: string,
  rawImage: unknown
) {
  await requireAdminAccess();
  const image = validateAdminInput(productImageInputSchema, rawImage);
  const created = await createProductImage(productId, mapImageData(image));

  if (image.isPrimary) {
    await setPrimaryProductImage(productId, created.id);
  }

  return created;
}

export async function updateAdminProductImage(id: string, rawImage: unknown) {
  await requireAdminAccess();
  const image = validateAdminInput(productImageInputSchema, rawImage);
  const updated = await updateProductImage(id, mapImageData(image));

  if (image.isPrimary) {
    await setPrimaryProductImage(updated.productId, updated.id);
  }

  return updated;
}

export async function deleteAdminProductImage(id: string) {
  await requireAdminAccess();
  return deleteProductImage(id);
}

export async function setAdminPrimaryProductImage(
  productId: string,
  imageId: string
) {
  await requireAdminAccess();
  return setPrimaryProductImage(productId, imageId);
}
