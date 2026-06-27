import { createCategoryAction } from "@/app/(admin)/admin/actions/categories.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCategoryForm } from "@/components/admin/AdminTaxonomyForms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function NewCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminPageHeader title="Nueva categoria" />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminCard>
        <AdminCategoryForm
          action={createCategoryAction}
          submitLabel="Crear categoria"
        />
      </AdminCard>
    </>
  );
}
