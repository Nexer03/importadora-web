import { createPromotionAction } from "@/app/(admin)/admin/actions/promotions.actions";
import { AdminPromotionForm } from "@/components/admin/AdminPromotionForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getPromotionTargets } from "@/services/admin/promotion-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPromotionPage({ searchParams }: PageProps) {
  const [params, targets] = await Promise.all([
    searchParams,
    getPromotionTargets(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Nuevo descuento automatico"
        description="Aplica un descuento por categoria, coleccion o a todo el catalogo."
      />
      <AdminNotice error={params.error} />
      <AdminPromotionForm
        action={createPromotionAction}
        categories={targets.categories}
        collections={targets.collections}
        submitLabel="Crear descuento"
      />
    </>
  );
}
