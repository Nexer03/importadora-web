import { prisma } from "@/lib/prisma";

/**
 * Promociones automaticas activas y dentro de su ventana de fechas.
 */
export function getActivePromotions(now: Date = new Date()) {
  return prisma.promotion.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    select: {
      discountType: true,
      discountValue: true,
      scope: true,
      categoryId: true,
      collectionId: true,
    },
  });
}
