import { createCollectionAction } from "@/app/(admin)/admin/actions/collections.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCollectionForm } from "@/components/admin/AdminTaxonomyForms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function NewCollectionPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminPageHeader title="Nueva coleccion" />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminCard>
        <AdminCollectionForm
          action={createCollectionAction}
          submitLabel="Crear coleccion"
        />
      </AdminCard>
    </>
  );
}
