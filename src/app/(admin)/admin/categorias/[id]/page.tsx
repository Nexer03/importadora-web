import { notFound } from "next/navigation";

import { updateCategoryAction } from "@/app/(admin)/admin/actions/categories.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCategoryForm } from "@/components/admin/AdminTaxonomyForms";
import { getAdminCategoryDetail } from "@/services/admin/category-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const [query, category] = await Promise.all([
    searchParams,
    getAdminCategoryDetail(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={category.name}
        description={`Productos relacionados: ${category.productsCount}`}
        actionHref="/admin/categorias"
        actionLabel="Volver"
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminCard>
        <AdminCategoryForm
          action={updateCategoryAction}
          category={category}
          submitLabel="Guardar categoria"
        />
      </AdminCard>
    </>
  );
}
