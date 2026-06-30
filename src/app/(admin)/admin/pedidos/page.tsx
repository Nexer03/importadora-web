import Link from "next/link";

import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminOrdersList } from "@/services/admin/order-admin.service";
import { formatMXN } from "@/utils/format";
import {
  labelFor,
  orderStatusLabels,
  orderStatusTone,
  paymentStatusLabels,
  paymentStatusTone,
} from "@/utils/order-labels";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
    q?: string;
    page?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const pageNum = Math.max(1, Math.trunc(Number(params.page) || 1));
  const data = await getAdminOrdersList({ q, page: pageNum });
  const orders = data.orders;

  function makeHref(page: number) {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (page > 1) search.set("page", String(page));
    const query = search.toString();
    return query ? `/admin/pedidos?${query}` : "/admin/pedidos";
  }

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        description="Pedidos recibidos, su estado de pago y de entrega."
      />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminSearch
        action="/admin/pedidos"
        placeholder="Buscar por numero, correo o nombre…"
        defaultValue={q}
      />

      {orders.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          {q ? "No hay pedidos que coincidan con la busqueda." : "Aun no hay pedidos."}
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Pedido</AdminTh>
              <AdminTh>Cliente</AdminTh>
              <AdminTh>Estado</AdminTh>
              <AdminTh>Pago</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Fecha</AdminTh>
              <AdminTh>Acciones</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <AdminTd>
                  <span className="font-bold text-zinc-950">
                    {order.orderNumber}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {order.itemCount} art.
                  </span>
                </AdminTd>
                <AdminTd>
                  {order.customerName}
                  <span className="block text-xs text-zinc-500">
                    {order.customerEmail}
                  </span>
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={orderStatusTone(order.status)}>
                    {labelFor(orderStatusLabels, order.status)}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={paymentStatusTone(order.paymentStatus)}>
                    {labelFor(paymentStatusLabels, order.paymentStatus)}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>{formatMXN(order.total)}</AdminTd>
                <AdminTd>{dateFormatter.format(order.createdAt)}</AdminTd>
                <AdminTd>
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="font-bold underline"
                  >
                    Ver
                  </Link>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      <AdminPagination
        page={data.page}
        totalPages={data.totalPages}
        makeHref={makeHref}
      />
    </>
  );
}
