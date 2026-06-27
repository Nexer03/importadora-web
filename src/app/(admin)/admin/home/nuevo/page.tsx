import { createHomeSectionAction } from "@/app/(admin)/admin/actions/home.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminHomeSectionForm } from "@/components/admin/AdminHomeSectionForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function NewHomeSectionPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminPageHeader title="Nueva seccion home" />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminCard>
        <AdminHomeSectionForm
          action={createHomeSectionAction}
          submitLabel="Crear seccion"
        />
      </AdminCard>
    </>
  );
}
