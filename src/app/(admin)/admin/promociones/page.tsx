import Link from "next/link";

import { deactivateCouponAction } from "@/app/(admin)/admin/actions/coupons.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminCouponsList } from "@/services/admin/coupon-admin.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const discountTypeLabels: Record<string, string> = {
  PERCENTAGE: "Porcentaje",
  FIXED_AMOUNT: "Monto fijo",
  FREE_SHIPPING: "Envio gratis",
};

function describeValue(type: string, value: number): string {
  if (type === "PERCENTAGE") return `${value}%`;
  if (type === "FIXED_AMOUNT") return formatMXN(value);
  return "—";
}

export default async function AdminCouponsPage({ searchParams }: PageProps) {
  const [params, coupons] = await Promise.all([
    searchParams,
    getAdminCouponsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Promociones"
        description="Cupones de descuento aplicables en el carrito."
        actionHref="/admin/promociones/nueva"
        actionLabel="Nuevo cupon"
      />
      <AdminNotice error={params.error} saved={params.saved} />

      {coupons.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Aun no hay cupones.
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Codigo</AdminTh>
              <AdminTh>Tipo</AdminTh>
              <AdminTh>Valor</AdminTh>
              <AdminTh>Usos</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Acciones</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <AdminTd>
                  <span className="font-bold text-zinc-950">{coupon.code}</span>
                </AdminTd>
                <AdminTd>{discountTypeLabels[coupon.discountType] ?? coupon.discountType}</AdminTd>
                <AdminTd>{describeValue(coupon.discountType, coupon.discountValue)}</AdminTd>
                <AdminTd>
                  {coupon.usesCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={coupon.isActive ? "success" : "muted"}>
                    {coupon.isActive ? "Activo" : "Inactivo"}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/promociones/${coupon.id}`}
                      className="font-bold underline"
                    >
                      Editar
                    </Link>
                    {coupon.isActive ? (
                      <form action={deactivateCouponAction}>
                        <input type="hidden" name="id" value={coupon.id} />
                        <button type="submit" className="font-bold underline">
                          Desactivar
                        </button>
                      </form>
                    ) : null}
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}
