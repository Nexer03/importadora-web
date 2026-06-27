import { notFound } from "next/navigation";

import { updateHomeSectionAction } from "@/app/(admin)/admin/actions/home.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminHomeSectionForm } from "@/components/admin/AdminHomeSectionForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminHomeSectionDetail } from "@/services/admin/home-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditHomeSectionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const [query, section] = await Promise.all([
    searchParams,
    getAdminHomeSectionDetail(id),
  ]);

  if (!section) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={section.title ?? section.type}
        actionHref="/admin/home"
        actionLabel="Volver"
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminCard>
        <AdminHomeSectionForm
          action={updateHomeSectionAction}
          section={section}
          submitLabel="Guardar seccion"
        />
      </AdminCard>
    </>
  );
}
