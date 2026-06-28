import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAdminAudiences() {
  return prisma.audience.findMany({
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

export function getAdminAudienceById(id: string) {
  return prisma.audience.findUnique({
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

export function createAudience(data: Prisma.AudienceCreateInput) {
  return prisma.audience.create({ data });
}

export function updateAudience(id: string, data: Prisma.AudienceUpdateInput) {
  return prisma.audience.update({
    where: { id },
    data,
  });
}

export async function deleteOrDeactivateAudience(id: string) {
  const products = await prisma.product.count({
    where: { audienceId: id },
  });

  if (products > 0) {
    return prisma.audience.update({
      where: { id },
      data: { isActive: false },
    });
  }

  return prisma.audience.delete({
    where: { id },
  });
}
