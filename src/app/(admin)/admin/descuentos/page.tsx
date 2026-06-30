import Link from "next/link";

import { deactivatePromotionAction } from "@/app/(admin)/admin/actions/promotions.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminPromotionsList } from "@/services/admin/promotion-admin.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const scopeLabels: Record<string, string> = {
  ALL: "Todos",
  CATEGORY: "Categoria",
  COLLECTION: "Coleccion",
};

function describeValue(type: string, value: number): string {
  return type === "PERCENTAGE" ? `${value}%` : formatMXN(value);
}

function describeScope(promo: {
  scope: string;
  categoryName: string | null;
  collectionName: string | null;
}): string {
  if (promo.scope === "CATEGORY") return promo.categoryName ?? "Categoria";
  if (promo.scope === "COLLECTION") return promo.collectionName ?? "Coleccion";
  return "Todos los productos";
}

export default async function AdminPromotionsPage({ searchParams }: PageProps) {
  const [params, promotions] = await Promise.all([
    searchParams,
    getAdminPromotionsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Descuentos automaticos"
        description="Descuentos por regla que se aplican solos en catalogo y carrito (sin codigo)."
        actionHref="/admin/descuentos/nuevo"
        actionLabel="Nuevo descuento"
      />
      <AdminNotice error={params.error} saved={params.saved} />

      {promotions.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Aun no hay descuentos automaticos.
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Nombre</AdminTh>
              <AdminTh>Descuento</AdminTh>
              <AdminTh>Aplica a</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Acciones</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {promotions.map((promo) => (
              <tr key={promo.id}>
                <AdminTd>
                  <span className="font-bold text-zinc-950">{promo.name}</span>
                </AdminTd>
                <AdminTd>{describeValue(promo.discountType, promo.discountValue)}</AdminTd>
                <AdminTd>
                  {scopeLabels[promo.scope]}
                  <span className="block text-xs text-zinc-500">
                    {describeScope(promo)}
                  </span>
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={promo.isActive ? "success" : "muted"}>
                    {promo.isActive ? "Activa" : "Inactiva"}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/descuentos/${promo.id}`}
                      className="font-bold underline"
                    >
                      Editar
                    </Link>
                    {promo.isActive ? (
                      <form action={deactivatePromotionAction}>
                        <input type="hidden" name="id" value={promo.id} />
                        <ConfirmSubmitButton
                          className="font-bold underline"
                          message="Desactivar este descuento?"
                        >
                          Desactivar
                        </ConfirmSubmitButton>
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
