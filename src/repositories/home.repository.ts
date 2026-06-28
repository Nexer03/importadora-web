import { prisma } from "@/lib/prisma";

export function getActiveHomeSections() {
  const now = new Date();

  return prisma.homeSection.findMany({
    where: {
      isActive: true,
      AND: [
        {
          OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        },
        {
          OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        },
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}
