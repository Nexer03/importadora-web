import { notFound } from "next/navigation";

import { updateCouponAction } from "@/app/(admin)/admin/actions/coupons.actions";
import { AdminCouponForm } from "@/components/admin/AdminCouponForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminCouponDetail } from "@/services/admin/coupon-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditCouponPage({ params, searchParams }: PageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const coupon = await getAdminCouponDetail(id);

  if (!coupon) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={`Cupon ${coupon.code}`}
        description={`Usado ${coupon.usesCount} ${
          coupon.usesCount === 1 ? "vez" : "veces"
        }.`}
      />
      <AdminNotice error={query.error} saved={query.saved} />
      <AdminCouponForm
        action={updateCouponAction}
        coupon={coupon}
        submitLabel="Guardar cambios"
      />
    </>
  );
}
