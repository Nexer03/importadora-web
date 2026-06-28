import Link from "next/link";
import { notFound } from "next/navigation";

import {
  updateOrderNotesAction,
  updateOrderShippingAction,
  updateOrderStatusAction,
} from "@/app/(admin)/admin/actions/orders.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import { getAdminOrderDetail } from "@/services/admin/order-admin.service";
import { formatMXN } from "@/utils/format";
import {
  deliveryMethodLabels,
  labelFor,
  orderStatusLabels,
  orderStatusTone,
  paymentStatusLabels,
  paymentStatusTone,
} from "@/utils/order-labels";
import { orderStatuses } from "@/validators/admin/order.validator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

const labelClass = "text-xs font-semibold uppercase tracking-wide text-zinc-500";
const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const order = await getAdminOrderDetail(id);

  if (!order) {
    notFound();
  }

  const hasAddress = order.deliveryMethod !== "LOCAL_PICKUP";

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/pedidos" className="text-sm font-semibold underline">
          ← Pedidos
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black tracking-normal text-zinc-950">
            {order.orderNumber}
          </h1>
          <AdminBadge tone={orderStatusTone(order.status)}>
            {labelFor(orderStatusLabels, order.status)}
          </AdminBadge>
          <AdminBadge tone={paymentStatusTone(order.paymentStatus)}>
            Pago: {labelFor(paymentStatusLabels, order.paymentStatus)}
          </AdminBadge>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {dateFormatter.format(order.createdAt)}
          {order.paymentProvider ? ` · ${order.paymentProvider}` : ""}
        </p>
      </div>

      <AdminNotice error={query.error} saved={query.saved} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <AdminCard title="Productos">
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>Producto</AdminTh>
                  <AdminTh>SKU</AdminTh>
                  <AdminTh>Precio</AdminTh>
                  <AdminTh>Cant.</AdminTh>
                  <AdminTh>Total</AdminTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <AdminTd>{item.productName}</AdminTd>
                    <AdminTd>{item.sku}</AdminTd>
                    <AdminTd>{formatMXN(item.unitPrice)}</AdminTd>
                    <AdminTd>{item.quantity}</AdminTd>
                    <AdminTd>{formatMXN(item.lineTotal)}</AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            <div className="mt-4 grid gap-1 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>{formatMXN(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <span>
                    Descuento{order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span>-{formatMXN(order.discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-zinc-600">
                <span>Envio</span>
                <span>{formatMXN(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-950">
                <span>Total</span>
                <span>{formatMXN(order.total)}</span>
              </div>
            </div>
          </AdminCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <AdminCard title="Cliente">
              <div className="grid gap-1 text-sm text-zinc-700">
                <p className="font-semibold text-zinc-950">{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </div>
            </AdminCard>

            <AdminCard title="Entrega">
              <p className="text-sm font-semibold text-zinc-950">
                {labelFor(deliveryMethodLabels, order.deliveryMethod)}
              </p>
              {hasAddress ? (
                <div className="mt-2 grid gap-0.5 text-sm text-zinc-700">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {[order.postalCode, order.city, order.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {order.addressReference ? (
                    <p className="text-zinc-500">Ref: {order.addressReference}</p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">
                  Recoleccion en punto de la tienda.
                </p>
              )}
            </AdminCard>
          </div>

          <AdminCard title="Pagos" description="Transacciones registradas del pedido.">
            {order.payments.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin transacciones registradas.</p>
            ) : (
              <AdminTable>
                <thead>
                  <tr>
                    <AdminTh>Proveedor</AdminTh>
                    <AdminTh>Estado</AdminTh>
                    <AdminTh>Monto</AdminTh>
                    <AdminTh>Referencia</AdminTh>
                    <AdminTh>Fecha</AdminTh>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <AdminTd>{payment.provider}</AdminTd>
                      <AdminTd>{payment.status}</AdminTd>
                      <AdminTd>
                        {formatMXN(payment.amount)} {payment.currency}
                      </AdminTd>
                      <AdminTd>{payment.providerCaptureId ?? payment.providerOrderId ?? "—"}</AdminTd>
                      <AdminTd>{dateFormatter.format(payment.createdAt)}</AdminTd>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            )}
          </AdminCard>
        </div>

        <div className="grid gap-6">
          <AdminCard title="Estado del pedido">
            <form action={updateOrderStatusAction} className="grid gap-3">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label className={labelClass} htmlFor="status">
                  Cambiar estado
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={order.status}
                  className={inputClass}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {labelFor(orderStatusLabels, status)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
              >
                Actualizar estado
              </button>
            </form>
          </AdminCard>

          <AdminCard title="Envio / Paqueteria">
            <form action={updateOrderShippingAction} className="grid gap-3">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label className={labelClass} htmlFor="carrier">
                  Paqueteria
                </label>
                <input
                  id="carrier"
                  name="carrier"
                  defaultValue={order.carrier ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="trackingNumber">
                  Numero de rastreo
                </label>
                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  defaultValue={order.trackingNumber ?? ""}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
              >
                Guardar envio
              </button>
            </form>
          </AdminCard>

          <AdminCard title="Notas internas">
            <form action={updateOrderNotesAction} className="grid gap-3">
              <input type="hidden" name="id" value={order.id} />
              <textarea
                name="notes"
                rows={4}
                defaultValue={order.notes ?? ""}
                className="w-full rounded-md border border-zinc-300 p-3 text-sm text-zinc-950 outline-none focus:border-zinc-950"
                placeholder="Notas visibles solo para el equipo."
              />
              <button
                type="submit"
                className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950"
              >
                Guardar notas
              </button>
            </form>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
