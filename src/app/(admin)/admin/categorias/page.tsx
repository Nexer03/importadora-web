import Link from "next/link";

import { deleteOrDeactivateCategoryAction } from "@/app/(admin)/admin/actions/categories.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminCategoriesList } from "@/services/admin/category-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    getAdminCategoriesList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Categorias"
        description="Agrupaciones principales del catalogo."
        actionHref="/admin/categorias/nueva"
        actionLabel="Nueva categoria"
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
          {categories.map((category) => (
            <tr key={category.id}>
              <AdminTd>{category.name}</AdminTd>
              <AdminTd>{category.slug}</AdminTd>
              <AdminTd>
                <AdminBadge tone={category.isActive ? "success" : "muted"}>
                  {category.isActive ? "Activa" : "Inactiva"}
                </AdminBadge>
              </AdminTd>
              <AdminTd>{category.sortOrder}</AdminTd>
              <AdminTd>{category.productsCount}</AdminTd>
              <AdminTd>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/categorias/${category.id}`}
                    className="font-bold underline"
                  >
                    Editar
                  </Link>
                  <form action={deleteOrDeactivateCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
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
