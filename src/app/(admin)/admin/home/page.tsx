import Link from "next/link";

import { deleteHomeSectionAction } from "@/app/(admin)/admin/actions/home.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminHomeSectionsList } from "@/services/admin/home-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminHomePage({ searchParams }: PageProps) {
  const [params, sections] = await Promise.all([
    searchParams,
    getAdminHomeSectionsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Home"
        description="Secciones configurables de la pagina inicial."
        actionHref="/admin/home/nuevo"
        actionLabel="Nueva seccion"
      />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Tipo</AdminTh>
            <AdminTh>Titulo</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Acciones</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {sections.map((section) => (
            <tr key={section.id}>
              <AdminTd>{section.type}</AdminTd>
              <AdminTd>{section.title ?? "Sin titulo"}</AdminTd>
              <AdminTd>
                <AdminBadge tone={section.isActive ? "success" : "muted"}>
                  {section.isActive ? "Activa" : "Inactiva"}
                </AdminBadge>
              </AdminTd>
              <AdminTd>{section.sortOrder}</AdminTd>
              <AdminTd>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/home/${section.id}`}
                    className="font-bold underline"
                  >
                    Editar
                  </Link>
                  <form action={deleteHomeSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <button type="submit" className="font-bold underline">
                      Eliminar
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
