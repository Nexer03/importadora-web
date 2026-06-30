import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import {
  getAdminInventoryMovements,
  inventoryMovementLabels,
} from "@/services/admin/inventory-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = Math.max(1, Math.trunc(Number(params.page) || 1));
  const data = await getAdminInventoryMovements({ page: pageNum });

  return (
    <>
      <AdminPageHeader
        title="Movimientos de inventario"
        description="Historial de reservas, ventas, devoluciones y ajustes de stock."
      />

      {data.movements.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Aun no hay movimientos de inventario.
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Fecha</AdminTh>
              <AdminTh>Producto</AdminTh>
              <AdminTh>Tipo</AdminTh>
              <AdminTh>Cantidad</AdminTh>
              <AdminTh>Nota</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {data.movements.map((m) => (
              <tr key={m.id}>
                <AdminTd>{dateFormatter.format(m.createdAt)}</AdminTd>
                <AdminTd>
                  {m.productName}
                  <span className="block text-xs text-zinc-500">{m.sku}</span>
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={m.quantity >= 0 ? "success" : "warning"}>
                    {inventoryMovementLabels[m.type] ?? m.type}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>
                  <span
                    className={
                      m.quantity >= 0 ? "text-emerald-700" : "text-zinc-950"
                    }
                  >
                    {m.quantity >= 0 ? `+${m.quantity}` : m.quantity}
                  </span>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-zinc-500">{m.note ?? "—"}</span>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        makeHref={(page) =>
          page > 1 ? `/admin/inventario?page=${page}` : "/admin/inventario"
        }
      />
    </>
  );
}
