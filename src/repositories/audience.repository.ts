import { prisma } from "@/lib/prisma";

export function getActiveAudiences() {
  return prisma.audience.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}
