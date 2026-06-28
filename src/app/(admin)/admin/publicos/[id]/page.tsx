import { notFound } from "next/navigation";

import { updateAudienceAction } from "@/app/(admin)/admin/actions/audiences.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminAudienceForm } from "@/components/admin/AdminTaxonomyForms";
import { getAdminAudienceDetail } from "@/services/admin/audience-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditAudiencePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const [query, audience] = await Promise.all([
    searchParams,
    getAdminAudienceDetail(id),
  ]);

  if (!audience) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={audience.name}
        description={`Productos relacionados: ${audience.productsCount}`}
        actionHref="/admin/publicos"
        actionLabel="Volver"
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminCard>
        <AdminAudienceForm
          action={updateAudienceAction}
          audience={audience}
          submitLabel="Guardar publico"
        />
      </AdminCard>
    </>
  );
}
