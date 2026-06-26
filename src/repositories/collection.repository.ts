import { prisma } from "@/lib/prisma";

export function getActiveCollections() {
  return prisma.collection.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function getCollectionBySlug(slug: string) {
  return prisma.collection.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });
}
