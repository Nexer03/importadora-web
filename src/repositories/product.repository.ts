import { Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ProductListParams } from "@/types/catalog";

const DEFAULT_PRODUCT_LIMIT = 24;
const MAX_PRODUCT_LIMIT = 60;

export const publicProductInclude = {
  category: true,
  audience: true,
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  },
  variants: {
    where: {
      isActive: true,
    },
    orderBy: [{ createdAt: "asc" }],
  },
  collections: {
    where: {
      collection: {
        isActive: true,
      },
    },
    include: {
      collection: true,
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductWithPublicRelations = Prisma.ProductGetPayload<{
  include: typeof publicProductInclude;
}>;

function clampLimit(limit?: number) {
  if (!Number.isFinite(limit)) {
    return DEFAULT_PRODUCT_LIMIT;
  }

  return Math.min(
    Math.max(Math.trunc(limit ?? DEFAULT_PRODUCT_LIMIT), 1),
    MAX_PRODUCT_LIMIT
  );
}

function buildPublicProductWhere(
  params: ProductListParams = {}
): Prisma.ProductWhereInput {
  const search = params.q?.trim();

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
    indexable: true,
    category: {
      isActive: true,
      ...(params.category ? { slug: params.category } : {}),
    },
    audience: {
      isActive: true,
      ...(params.audience ? { slug: params.audience } : {}),
    },
  };

  if (params.collection) {
    where.collections = {
      some: {
        collection: {
          slug: params.collection,
          isActive: true,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
      { category: { name: { contains: search }, isActive: true } },
      { audience: { name: { contains: search }, isActive: true } },
    ];
  }

  return where;
}

export function getPublicProducts(params: ProductListParams = {}) {
  return prisma.product.findMany({
    where: buildPublicProductWhere(params),
    include: publicProductInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: clampLimit(params.limit),
  });
}

export function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: {
      ...buildPublicProductWhere(),
      isFeatured: true,
    },
    include: publicProductInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: clampLimit(limit),
  });
}

export function getNewProducts(limit = 8) {
  return prisma.product.findMany({
    where: {
      ...buildPublicProductWhere(),
      isNew: true,
    },
    include: publicProductInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: clampLimit(limit),
  });
}

export function getDiscountedProducts(limit = 8) {
  return prisma.product.findMany({
    where: {
      ...buildPublicProductWhere(),
      discountPrice: {
        not: null,
      },
    },
    include: publicProductInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: clampLimit(limit),
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      ...buildPublicProductWhere(),
      slug,
    },
    include: publicProductInclude,
  });
}

export function getProductsByCategorySlug(slug: string) {
  return getPublicProducts({
    category: slug,
    limit: 48,
  });
}

export function getProductsByCollectionSlug(slug: string) {
  return getPublicProducts({
    collection: slug,
    limit: 48,
  });
}

export function getProductsByAudienceSlug(slug: string) {
  return getPublicProducts({
    audience: slug,
    limit: 48,
  });
}

export function getSitemapProducts(limit = 500) {
  return prisma.product.findMany({
    where: buildPublicProductWhere(),
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: Math.min(Math.max(Math.trunc(limit), 1), 500),
  });
}
