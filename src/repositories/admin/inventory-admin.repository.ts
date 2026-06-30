import { prisma } from "@/lib/prisma";

export const ADMIN_INVENTORY_PAGE_SIZE = 30;

export function getInventoryMovementsPage(params: { page?: number } = {}) {
  const page = Math.max(1, Math.trunc(params.page ?? 1));

  return Promise.all([
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productVariant: {
          select: {
            sku: true,
            name: true,
            product: { select: { name: true, slug: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
      skip: (page - 1) * ADMIN_INVENTORY_PAGE_SIZE,
      take: ADMIN_INVENTORY_PAGE_SIZE,
    }),
    prisma.inventoryMovement.count(),
  ]);
}

export type AdminInventoryRow = Awaited<
  ReturnType<typeof getInventoryMovementsPage>
>[0][number];
