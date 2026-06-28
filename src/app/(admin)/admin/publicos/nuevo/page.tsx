import { createAudienceAction } from "@/app/(admin)/admin/actions/audiences.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminAudienceForm } from "@/components/admin/AdminTaxonomyForms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function NewAudiencePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminPageHeader title="Nuevo publico" />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminCard>
        <AdminAudienceForm
          action={createAudienceAction}
          submitLabel="Crear publico"
        />
      </AdminCard>
    </>
  );
}
