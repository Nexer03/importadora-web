import { createCouponAction } from "@/app/(admin)/admin/actions/coupons.actions";
import { AdminCouponForm } from "@/components/admin/AdminCouponForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewCouponPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <AdminPageHeader
        title="Nuevo cupon"
        description="Crea un cupon de descuento para el carrito."
      />
      <AdminNotice error={params.error} />
      <AdminCouponForm action={createCouponAction} submitLabel="Crear cupon" />
    </>
  );
}
