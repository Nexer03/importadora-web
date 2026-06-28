import type {
  Audience,
  Category,
  Collection,
  HomeSection,
  Prisma,
  StoreSetting,
} from "@prisma/client";

import { getActiveAudiences } from "@/repositories/audience.repository";
import { getActiveCategories } from "@/repositories/category.repository";
import {
  getActiveCollections,
  getCollectionBySlug,
} from "@/repositories/collection.repository";
import {
  getDiscountedProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductBySlug,
  getProductsByAudienceSlug,
  getProductsByCategorySlug,
  getProductsByCollectionSlug,
  getPublicProducts,
  getPublicProductsPage,
  PUBLIC_PAGE_SIZE,
  type ProductWithPublicRelations,
} from "@/repositories/product.repository";
import {
  resolveProductPrice,
  type PricingPromotion,
} from "@/services/pricing.service";
import { getActivePricingPromotions } from "@/services/promotion.service";
import type {
  AudiencePageData,
  CatalogHomeData,
  CategoryPageData,
  CollectionPageData,
  HomeSectionDTO,
  ProductListParams,
  PublicAudience,
  PublicCategory,
  PublicCollection,
  ProductsPage,
  PublicProductCard,
  PublicProductDetail,
  PublicProductImage,
  PublicProductVariant,
  StoreSettingDTO,
} from "@/types/catalog";

type DecimalLike = {
  toString(): string;
};

function toMoney(value: DecimalLike): number {
  return Number(value.toString());
}

function toNullableMoney(value: DecimalLike | null): number | null {
  return value ? toMoney(value) : null;
}

export function toPublicCategory(category: Category): PublicCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    sortOrder: category.sortOrder,
    seo: {
      title: category.seoTitle,
      description: category.seoDescription,
      keywords: category.seoKeywords,
      ogImage: category.ogImage,
      indexable: category.indexable,
    },
  };
}

export function toPublicAudience(audience: Audience): PublicAudience {
  return {
    id: audience.id,
    name: audience.name,
    slug: audience.slug,
    description: audience.description,
    sortOrder: audience.sortOrder,
  };
}

export function toPublicCollection(collection: Collection): PublicCollection {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    imageUrl: collection.imageUrl,
    sortOrder: collection.sortOrder,
    seo: {
      title: collection.seoTitle,
      description: collection.seoDescription,
      keywords: collection.seoKeywords,
      ogImage: collection.ogImage,
      indexable: collection.indexable,
    },
  };
}

function toPublicProductImage(
  image: ProductWithPublicRelations["images"][number]
): PublicProductImage {
  return {
    id: image.id,
    url: image.url,
    altText: image.altText,
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  };
}

function getPrimaryImage(
  images: ProductWithPublicRelations["images"]
): PublicProductImage | null {
  const primary = images.find((image) => image.isPrimary) ?? images[0];
  return primary ? toPublicProductImage(primary) : null;
}

function toPublicVariant(
  variant: ProductWithPublicRelations["variants"][number],
  fallbackPrice: number
): PublicProductVariant {
  return {
    id: variant.id,
    sku: variant.sku,
    name: variant.name,
    color: variant.color,
    size: variant.size,
    price: variant.priceOverride ? toMoney(variant.priceOverride) : fallbackPrice,
    stockAvailable: Math.max(variant.stockAvailable, 0),
  };
}

export function toPublicProductCard(
  product: ProductWithPublicRelations,
  promotions: PricingPromotion[] = []
): PublicProductCard {
  const basePrice = toMoney(product.basePrice);
  const manualDiscountPrice = toNullableMoney(product.discountPrice);
  const collectionIds = product.collections.map((item) => item.collection.id);
  const pricing = resolveProductPrice({
    basePrice,
    discountPrice: manualDiscountPrice,
    categoryId: product.categoryId,
    collectionIds,
    promotions,
  });
  const activeVariants = product.variants.filter((variant) => variant.isActive);
  const stockAvailable = activeVariants.reduce(
    (total, variant) => total + Math.max(variant.stockAvailable, 0),
    0
  );

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    basePrice,
    discountPrice: pricing.hasDiscount ? pricing.price : null,
    price: pricing.price,
    hasDiscount: pricing.hasDiscount,
    discountPercentage: pricing.discountPercentage,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    primaryImage: getPrimaryImage(product.images),
    category: toPublicCategory(product.category),
    audience: toPublicAudience(product.audience),
    collections: product.collections.map((item) =>
      toPublicCollection(item.collection)
    ),
    stockAvailable,
  };
}

export function toPublicProductDetail(
  product: ProductWithPublicRelations,
  promotions: PricingPromotion[] = []
): PublicProductDetail {
  const card = toPublicProductCard(product, promotions);

  return {
    ...card,
    description: product.description,
    images: product.images.map(toPublicProductImage),
    variants: product.variants.map((variant) =>
      toPublicVariant(variant, card.price)
    ),
    seo: {
      title: product.seoTitle,
      description: product.seoDescription,
      keywords: product.seoKeywords,
      canonicalUrl: product.canonicalUrl,
      ogImage: product.ogImage,
      indexable: product.indexable,
    },
    sku: product.variants[0]?.sku ?? null,
  };
}

function toHomeSectionData(
  data: Prisma.JsonValue | null
): Record<string, unknown> | null {
  if (!data || Array.isArray(data) || typeof data !== "object") {
    return null;
  }

  return data as Record<string, unknown>;
}

export function toHomeSectionDTO(section: HomeSection): HomeSectionDTO {
  return {
    id: section.id,
    type: section.type,
    title: section.title,
    subtitle: section.subtitle,
    imageUrl: section.imageUrl,
    buttonText: section.buttonText,
    buttonUrl: section.buttonUrl,
    data: toHomeSectionData(section.data),
    sortOrder: section.sortOrder,
  };
}

export function toStoreSettingDTO(setting: StoreSetting): StoreSettingDTO {
  return {
    key: setting.key,
    value: setting.value,
  };
}

export function settingsToRecord(
  settings: StoreSettingDTO[]
): Record<string, string> {
  return settings.reduce<Record<string, string>>((record, setting) => {
    record[setting.key] = setting.value;
    return record;
  }, {});
}

export async function getCatalogFilters() {
  const [categories, audiences, collections] = await Promise.all([
    getActiveCategories(),
    getActiveAudiences(),
    getActiveCollections(),
  ]);

  return {
    categories: categories.map(toPublicCategory),
    audiences: audiences.map(toPublicAudience),
    collections: collections.map(toPublicCollection),
  };
}

export async function getCatalogHomeData(): Promise<CatalogHomeData> {
  const [filters, promotions, newProducts, discountedProducts, featuredProducts] =
    await Promise.all([
      getCatalogFilters(),
      getActivePricingPromotions(),
      getNewProducts(8),
      getDiscountedProducts(8),
      getFeaturedProducts(8),
    ]);

  return {
    ...filters,
    newProducts: newProducts.map((p) => toPublicProductCard(p, promotions)),
    discountedProducts: discountedProducts.map((p) =>
      toPublicProductCard(p, promotions)
    ),
    featuredProducts: featuredProducts.map((p) =>
      toPublicProductCard(p, promotions)
    ),
  };
}

export async function getProductsList(
  params: ProductListParams = {}
): Promise<PublicProductCard[]> {
  const [products, promotions] = await Promise.all([
    getPublicProducts(params),
    getActivePricingPromotions(),
  ]);
  return products.map((p) => toPublicProductCard(p, promotions));
}

export async function getProductsPage(
  params: ProductListParams = {}
): Promise<ProductsPage> {
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const [[products, total], promotions] = await Promise.all([
    getPublicProductsPage({ ...params, page }),
    getActivePricingPromotions(),
  ]);

  return {
    products: products.map((p) => toPublicProductCard(p, promotions)),
    total,
    page,
    pageSize: PUBLIC_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PUBLIC_PAGE_SIZE)),
  };
}

export async function getProductDetail(
  slug: string
): Promise<PublicProductDetail | null> {
  const [product, promotions] = await Promise.all([
    getProductBySlug(slug),
    getActivePricingPromotions(),
  ]);
  return product ? toPublicProductDetail(product, promotions) : null;
}

export async function getCategoryPageData(
  slug: string
): Promise<CategoryPageData | null> {
  const [filters, products, promotions] = await Promise.all([
    getCatalogFilters(),
    getProductsByCategorySlug(slug),
    getActivePricingPromotions(),
  ]);

  const category = filters.categories.find((item) => item.slug === slug);

  if (!category) {
    return null;
  }

  return {
    category,
    products: products.map((p) => toPublicProductCard(p, promotions)),
  };
}

export async function getCollectionPageData(
  slug: string
): Promise<CollectionPageData | null> {
  const [collection, products, promotions] = await Promise.all([
    getCollectionBySlug(slug),
    getProductsByCollectionSlug(slug),
    getActivePricingPromotions(),
  ]);

  if (!collection) {
    return null;
  }

  return {
    collection: toPublicCollection(collection),
    products: products.map((p) => toPublicProductCard(p, promotions)),
  };
}

export async function getAudiencePageData(
  slug: string
): Promise<AudiencePageData | null> {
  const [filters, products, promotions] = await Promise.all([
    getCatalogFilters(),
    getProductsByAudienceSlug(slug),
    getActivePricingPromotions(),
  ]);

  const audience = filters.audiences.find((item) => item.slug === slug);

  if (!audience) {
    return null;
  }

  return {
    audience,
    products: products.map((p) => toPublicProductCard(p, promotions)),
  };
}
