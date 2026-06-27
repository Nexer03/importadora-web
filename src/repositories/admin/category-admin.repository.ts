import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAdminCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function getAdminCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export function createCategory(data: Prisma.CategoryCreateInput) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteOrDeactivateCategory(id: string) {
  const products = await prisma.product.count({
    where: { categoryId: id },
  });

  if (products > 0) {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  return prisma.category.delete({
    where: { id },
  });
}

export function countActiveCategories() {
  return prisma.category.count({
    where: {
      isActive: true,
    },
  });
}
