import Link from "next/link";

import { deleteOrDeactivateCollectionAction } from "@/app/(admin)/admin/actions/collections.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminCollectionsList } from "@/services/admin/collection-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminCollectionsPage({ searchParams }: PageProps) {
  const [params, collections] = await Promise.all([
    searchParams,
    getAdminCollectionsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Colecciones"
        description="Agrupaciones comerciales como novedades, descuentos o temporadas."
        actionHref="/admin/colecciones/nueva"
        actionLabel="Nueva coleccion"
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
          {collections.map((collection) => (
            <tr key={collection.id}>
              <AdminTd>{collection.name}</AdminTd>
              <AdminTd>{collection.slug}</AdminTd>
              <AdminTd>
                <AdminBadge tone={collection.isActive ? "success" : "muted"}>
                  {collection.isActive ? "Activa" : "Inactiva"}
                </AdminBadge>
              </AdminTd>
              <AdminTd>{collection.sortOrder}</AdminTd>
              <AdminTd>{collection.productsCount}</AdminTd>
              <AdminTd>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/colecciones/${collection.id}`}
                    className="font-bold underline"
                  >
                    Editar
                  </Link>
                  <form action={deleteOrDeactivateCollectionAction}>
                    <input type="hidden" name="id" value={collection.id} />
                    <ConfirmSubmitButton
                      className="font-bold underline"
                      message="Desactivar esta coleccion?"
                    >
                      Desactivar
                    </ConfirmSubmitButton>
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
