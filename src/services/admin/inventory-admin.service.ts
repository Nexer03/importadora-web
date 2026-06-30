import {
  ADMIN_INVENTORY_PAGE_SIZE,
  getInventoryMovementsPage,
  type AdminInventoryRow,
} from "@/repositories/admin/inventory-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";

export const inventoryMovementLabels: Record<string, string> = {
  INITIAL_STOCK: "Stock inicial",
  MANUAL_ADJUSTMENT: "Ajuste manual",
  SALE: "Venta",
  RESERVATION: "Reserva",
  RESERVATION_RELEASE: "Liberacion de reserva",
  RETURN: "Devolucion",
};

export type AdminInventoryMovementDTO = {
  id: string;
  type: string;
  quantity: number;
  note: string | null;
  productName: string;
  sku: string;
  by: string | null;
  createdAt: Date;
};

function mapMovement(row: AdminInventoryRow): AdminInventoryMovementDTO {
  return {
    id: row.id,
    type: row.type,
    quantity: row.quantity,
    note: row.note,
    productName: row.productVariant.product.name,
    sku: row.productVariant.sku,
    by: row.user?.name ?? row.user?.email ?? null,
    createdAt: row.createdAt,
  };
}

export async function getAdminInventoryMovements(
  params: { page?: number } = {}
) {
  await requireAdminAccess();
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const [rows, total] = await getInventoryMovementsPage({ page });
  return {
    movements: rows.map(mapMovement),
    total,
    page,
    pageSize: ADMIN_INVENTORY_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_INVENTORY_PAGE_SIZE)),
  };
}
