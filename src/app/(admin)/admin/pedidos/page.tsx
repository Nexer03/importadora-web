import Link from "next/link";

import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const [params, orders] = await Promise.all([
    searchParams,
    getAdminOrdersList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        description="Pedidos recibidos, su estado de pago y de entrega."
      />
      <AdminNotice error={params.error} saved={params.saved} />

      {orders.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Aun no hay pedidos.
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
    </>
  );
}
