import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminAuditLogs } from "@/services/admin/audit-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminAuditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = Math.max(1, Math.trunc(Number(params.page) || 1));
  const data = await getAdminAuditLogs({ page: pageNum });

  return (
    <>
      <AdminPageHeader
        title="Auditoria"
        description="Registro de acciones importantes del panel (estado de pedidos, productos, promociones)."
      />

      {data.logs.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Aun no hay registros de auditoria.
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Fecha</AdminTh>
              <AdminTh>Accion</AdminTh>
              <AdminTh>Detalle</AdminTh>
              <AdminTh>Usuario</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {data.logs.map((log) => (
              <tr key={log.id}>
                <AdminTd>{dateFormatter.format(log.createdAt)}</AdminTd>
                <AdminTd>
                  <span className="font-semibold text-zinc-950">
                    {log.action}
                  </span>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-zinc-500">
                    {log.detail ?? "—"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <span className="text-xs text-zinc-500">{log.by ?? "—"}</span>
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
          page > 1 ? `/admin/auditoria?page=${page}` : "/admin/auditoria"
        }
      />
    </>
  );
}
