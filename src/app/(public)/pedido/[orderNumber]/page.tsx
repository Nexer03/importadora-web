import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { reorderAction } from "@/app/(public)/carrito/actions";
import { getOrderDetail } from "@/services/checkout.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

type OrderPageProps = {
  params: Promise<{ orderNumber: string }>;
};

type PaymentNotice = {
  className: string;
  message: string;
};

function getPaymentNotice(status: string): PaymentNotice {
  switch (status) {
    case "PAID":
      return {
        className: "bg-emerald-50 text-emerald-800",
        message:
          "Pago confirmado. Recibimos tu pago correctamente y preparamos tu pedido.",
      };
    case "PAYMENT_FAILED":
      return {
        className: "bg-red-50 text-red-700",
        message:
          "El pago no se completo. Puedes intentar de nuevo agregando los productos al carrito.",
      };
    case "CANCELLED":
      return {
        className: "bg-zinc-100 text-zinc-700",
        message: "Este pedido fue cancelado.",
      };
    default:
      return {
        className: "bg-amber-50 text-amber-800",
        message:
          "Tu pago esta pendiente. Si ya completaste el pago, puede tardar unos segundos en reflejarse.",
      };
  }
}

const deliveryLabels: Record<string, string> = {
  NATIONAL_SHIPPING: "Envio nacional",
  LOCAL_DELIVERY: "Entrega local",
  LOCAL_PICKUP: "Recoleccion local",
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PREPARING: "En preparacion",
  READY_FOR_PICKUP: "Listo para recoleccion",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  PAYMENT_FAILED: "Pago fallido",
  REFUNDED: "Reembolsado",
};

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderDetail(orderNumber);

  if (!order) {
    notFound();
  }

  const hasAddress = order.deliveryMethod !== "LOCAL_PICKUP";
  const paymentNotice = getPaymentNotice(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-zinc-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Pedido recibido
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-normal text-zinc-950 sm:text-3xl">
          Gracias, {order.customerName.split(" ")[0]}.
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Tu pedido <span className="font-bold text-zinc-950">{order.orderNumber}</span>{" "}
          quedo registrado con estado{" "}
          <span className="font-semibold text-zinc-950">
            {statusLabels[order.status] ?? order.status}
          </span>
          .
        </p>
        <p className={`mt-3 rounded-md px-3 py-2 text-sm ${paymentNotice.className}`}>
          {paymentNotice.message}
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-5 text-sm">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
            Contacto
          </p>
          <p className="mt-3 text-zinc-700">{order.customerName}</p>
          <p className="text-zinc-700">{order.customerEmail}</p>
          <p className="text-zinc-700">{order.customerPhone}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 p-5 text-sm">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
            Entrega
          </p>
          <p className="mt-3 font-semibold text-zinc-950">
            {deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}
          </p>
          {hasAddress ? (
            <div className="mt-2 text-zinc-700">
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
            <p className="mt-2 text-zinc-700">
              Recoleccion en punto definido por la tienda.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 p-5">
        <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
          Resumen
        </p>
        <ul className="mt-4 grid gap-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-zinc-700">
                {item.productName}
                <span className="text-zinc-400"> × {item.quantity}</span>
                <span className="block text-xs text-zinc-400">{item.sku}</span>
              </span>
              <span className="font-semibold text-zinc-950">
                {formatMXN(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-zinc-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-zinc-600">
            <span>Subtotal</span>
            <span>{formatMXN(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 ? (
            <div className="mt-1 flex items-center justify-between text-emerald-700">
              <span>Descuento{order.couponCode ? ` (${order.couponCode})` : ""}</span>
              <span>-{formatMXN(order.discountAmount)}</span>
            </div>
          ) : null}
          <div className="mt-1 flex items-center justify-between text-zinc-600">
            <span>Envio</span>
            <span>
              {order.shippingCost > 0 ? formatMXN(order.shippingCost) : "Gratis"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-base font-black text-zinc-950">
            <span>Total</span>
            <span>{formatMXN(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <form action={reorderAction}>
          <input type="hidden" name="orderNumber" value={order.orderNumber} />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
          >
            Volver a comprar
          </button>
        </form>
        <Link
          href="/productos"
          className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-5 text-sm font-bold text-zinc-950"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
