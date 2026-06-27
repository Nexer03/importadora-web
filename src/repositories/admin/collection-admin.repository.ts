import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAdminCollections() {
  return prisma.collection.findMany({
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

export function getAdminCollectionById(id: string) {
  return prisma.collection.findUnique({
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

export function createCollection(data: Prisma.CollectionCreateInput) {
  return prisma.collection.create({ data });
}

export function updateCollection(
  id: string,
  data: Prisma.CollectionUpdateInput
) {
  return prisma.collection.update({
    where: { id },
    data,
  });
}

export async function deleteOrDeactivateCollection(id: string) {
  const products = await prisma.productCollection.count({
    where: { collectionId: id },
  });

  if (products > 0) {
    return prisma.collection.update({
      where: { id },
      data: { isActive: false },
    });
  }

  return prisma.collection.delete({
    where: { id },
  });
}

export function attachProductToCollection(
  productId: string,
  collectionId: string
) {
  return prisma.productCollection.upsert({
    where: {
      productId_collectionId: {
        productId,
        collectionId,
      },
    },
    update: {},
    create: {
      productId,
      collectionId,
    },
  });
}

export function detachProductFromCollection(
  productId: string,
  collectionId: string
) {
  return prisma.productCollection.deleteMany({
    where: {
      productId,
      collectionId,
    },
  });
}

export function countActiveCollections() {
  return prisma.collection.count({
    where: {
      isActive: true,
    },
  });
}
