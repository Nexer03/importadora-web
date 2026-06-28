import Link from "next/link";

import { deleteOrDeactivateAudienceAction } from "@/app/(admin)/admin/actions/audiences.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminAudiencesList } from "@/services/admin/audience-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminAudiencesPage({ searchParams }: PageProps) {
  const [params, audiences] = await Promise.all([
    searchParams,
    getAdminAudiencesList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Publicos"
        description="Segmentos de venta como dama, caballero y unisex."
        actionHref="/admin/publicos/nuevo"
        actionLabel="Nuevo publico"
      />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Nombre</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Productos</AdminTh>
            <AdminTh>Acciones</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {audiences.map((audience) => (
            <tr key={audience.id}>
              <AdminTd>{audience.name}</AdminTd>
              <AdminTd>{audience.slug}</AdminTd>
              <AdminTd>
                <AdminBadge tone={audience.isActive ? "success" : "muted"}>
                  {audience.isActive ? "Activo" : "Inactivo"}
                </AdminBadge>
              </AdminTd>
              <AdminTd>{audience.sortOrder}</AdminTd>
              <AdminTd>{audience.productsCount}</AdminTd>
              <AdminTd>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/publicos/${audience.id}`}
                    className="font-bold underline"
                  >
                    Editar
                  </Link>
                  <form action={deleteOrDeactivateAudienceAction}>
                    <input type="hidden" name="id" value={audience.id} />
                    <button type="submit" className="font-bold underline">
                      Desactivar
                    </button>
                  </form>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </>
  );
}
