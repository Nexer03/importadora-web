import { notFound } from "next/navigation";

import { updateCollectionAction } from "@/app/(admin)/admin/actions/collections.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCollectionForm } from "@/components/admin/AdminTaxonomyForms";
import { getAdminCollectionDetail } from "@/services/admin/collection-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditCollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const [query, collection] = await Promise.all([
    searchParams,
    getAdminCollectionDetail(id),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={collection.name}
        description={`Productos asociados: ${collection.productsCount}`}
        actionHref="/admin/colecciones"
        actionLabel="Volver"
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminCard>
        <AdminCollectionForm
          action={updateCollectionAction}
          collection={collection}
          submitLabel="Guardar coleccion"
        />
      </AdminCard>
    </>
  );
}
