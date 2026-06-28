import { notFound } from "next/navigation";

import { updatePromotionAction } from "@/app/(admin)/admin/actions/promotions.actions";
import { AdminPromotionForm } from "@/components/admin/AdminPromotionForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  getAdminPromotionDetail,
  getPromotionTargets,
} from "@/services/admin/promotion-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditPromotionPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, query, targets] = await Promise.all([
    params,
    searchParams,
    getPromotionTargets(),
  ]);
  const promotion = await getAdminPromotionDetail(id);

  if (!promotion) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={`Descuento: ${promotion.name}`}
        description="Edita el descuento automatico."
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminPromotionForm
        action={updatePromotionAction}
        categories={targets.categories}
        collections={targets.collections}
        promotion={promotion}
        submitLabel="Guardar cambios"
      />
    </>
  );
}
