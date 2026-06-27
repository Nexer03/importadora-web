import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function getAdminHomeSections() {
  return prisma.homeSection.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export function getAdminHomeSectionById(id: string) {
  return prisma.homeSection.findUnique({
    where: { id },
  });
}

export function createHomeSection(data: Prisma.HomeSectionCreateInput) {
  return prisma.homeSection.create({ data });
}

export function updateHomeSection(
  id: string,
  data: Prisma.HomeSectionUpdateInput
) {
  return prisma.homeSection.update({
    where: { id },
    data,
  });
}

export function deleteHomeSection(id: string) {
  return prisma.homeSection.delete({
    where: { id },
  });
}
