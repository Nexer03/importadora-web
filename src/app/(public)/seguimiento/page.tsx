import type { Metadata } from "next";
import Link from "next/link";

import { getOrderTracking } from "@/services/checkout.service";
import {
  labelFor,
  orderStatusLabels,
  paymentStatusLabels,
} from "@/utils/order-labels";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Seguir mi pedido",
  description:
    "Consulta el estado de tu pedido con tu numero de pedido y correo.",
  alternates: { canonical: "/seguimiento" },
};

type PageProps = {
  searchParams: Promise<{ order?: string; email?: string }>;
};

const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";
const labelClass = "text-xs font-bold uppercase tracking-wide text-zinc-500";

const dateFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" });

export default async function TrackingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const order = params.order?.trim();
  const email = params.email?.trim();
  const searched = Boolean(order && email);
  const tracking = searched
    ? await getOrderTracking(order as string, email as string)
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-normal text-zinc-950">
        Seguir mi pedido
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Ingresa tu numero de pedido y el correo con el que compraste.
      </p>

      <form method="GET" className="mt-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-6">
        <div>
          <label className={labelClass} htmlFor="order">
            Numero de pedido
          </label>
          <input
            id="order"
            name="order"
            required
            defaultValue={order ?? ""}
            placeholder="IMP-XXXXXXXX-XXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={email ?? ""}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="h-11 w-fit rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
        >
          Consultar
        </button>
      </form>

      {searched ? (
        tracking ? (
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
            <p className="text-sm text-zinc-500">
              Pedido{" "}
              <span className="font-bold text-zinc-950">
                {tracking.orderNumber}
              </span>{" "}
              · {dateFormatter.format(new Date(tracking.createdAt))}
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Estado del pedido</span>
                <span className="font-semibold text-zinc-950">
                  {labelFor(orderStatusLabels, tracking.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Estado del pago</span>
                <span className="font-semibold text-zinc-950">
                  {labelFor(paymentStatusLabels, tracking.paymentStatus)}
                </span>
              </div>
              {tracking.carrier ? (
                <div className="flex justify-between">
                  <span className="text-zinc-600">Paqueteria</span>
                  <span className="font-semibold text-zinc-950">
                    {tracking.carrier}
                  </span>
                </div>
              ) : null}
              {tracking.trackingNumber ? (
                <div className="flex justify-between">
                  <span className="text-zinc-600">Numero de rastreo</span>
                  <span className="font-semibold text-zinc-950">
                    {tracking.trackingNumber}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            No encontramos un pedido con esos datos. Verifica el numero y el
            correo, o{" "}
            <Link href="/contacto" className="font-semibold underline">
              contactanos
            </Link>
            .
          </p>
        )
      ) : null}
    </div>
  );
}
