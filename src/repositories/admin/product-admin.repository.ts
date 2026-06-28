import { Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const adminProductInclude = {
  category: true,
  audience: true,
  variants: {
    orderBy: [{ createdAt: "asc" }],
  },
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  },
  collections: {
    include: {
      collection: true,
    },
    orderBy: {
      collection: {
        sortOrder: "asc",
      },
    },
  },
} satisfies Prisma.ProductInclude;

export type AdminProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof adminProductInclude;
}>;

export function getAdminProducts() {
  return prisma.product.findMany({
    include: adminProductInclude,
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getLatestAdminProducts(limit = 6) {
  return prisma.product.findMany({
    include: adminProductInclude,
    orderBy: [{ createdAt: "desc" }],
    take: limit,
  });
}

export function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: adminProductInclude,
  });
}

export function createProduct(data: Prisma.ProductUncheckedCreateInput) {
  return prisma.product.create({
    data,
    include: adminProductInclude,
  });
}

export function createProductWithVariant(
  productData: Prisma.ProductUncheckedCreateInput,
  variantData: Omit<Prisma.ProductVariantUncheckedCreateInput, "productId">
) {
  return prisma.product.create({
    data: {
      ...productData,
      variants: {
        create: variantData,
      },
    },
    include: adminProductInclude,
  });
}

export function updateProduct(
  id: string,
  data: Prisma.ProductUncheckedUpdateInput
) {
  return prisma.product.update({
    where: { id },
    data,
    include: adminProductInclude,
  });
}

export function archiveProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: {
      status: ProductStatus.ARCHIVED,
    },
    include: adminProductInclude,
  });
}

export function createProductVariant(
  productId: string,
  data: Omit<Prisma.ProductVariantUncheckedCreateInput, "productId">
) {
  return prisma.productVariant.create({
    data: {
      ...data,
      productId,
    },
  });
}

export function updateProductVariant(
  id: string,
  data: Prisma.ProductVariantUncheckedUpdateInput
) {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

export function deleteProductVariant(id: string) {
  return prisma.productVariant.delete({
    where: { id },
  });
}

export function createProductImage(
  productId: string,
  data: Omit<Prisma.ProductImageUncheckedCreateInput, "productId">
) {
  return prisma.productImage.create({
    data: {
      ...data,
      productId,
    },
  });
}

export function updateProductImage(
  id: string,
  data: Prisma.ProductImageUncheckedUpdateInput
) {
  return prisma.productImage.update({
    where: { id },
    data,
  });
}

export function deleteProductImage(id: string) {
  return prisma.productImage.delete({
    where: { id },
  });
}

export function setPrimaryProductImage(productId: string, imageId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });

    return tx.productImage.update({
      where: { id: imageId, productId },
      data: { isPrimary: true },
    });
  });
}

export async function getAdminProductStatusCounts() {
  const [total, published, draft, archived, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
    prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
    prisma.product.count({ where: { status: ProductStatus.ARCHIVED } }),
    prisma.product.count({
      where: {
        variants: {
          some: {
            isActive: true,
            stockAvailable: {
              lte: 3,
            },
          },
        },
      },
    }),
  ]);

  return {
    total,
    published,
    draft,
    archived,
    lowStock,
  };
}
