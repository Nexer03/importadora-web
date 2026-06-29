import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/(public)/auth-actions";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getCurrentUser,
  getCustomerOrders,
} from "@/services/account.service";
import { formatMXN } from "@/utils/format";
import {
  labelFor,
  orderStatusLabels,
  paymentStatusLabels,
} from "@/utils/order-labels";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
});

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/cuenta");
  }

  const orders = await getCustomerOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Mi cuenta"
          title={user.name ? `Hola, ${user.name.split(" ")[0]}` : "Mi cuenta"}
          description={user.email}
        />
        <form action={signOutAction}>
          <button
            type="submit"
            className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            Cerrar sesion
          </button>
        </form>
      </div>

      {user.role === "ADMIN" ? (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
          Tienes acceso de administrador.{" "}
          <Link href="/admin" className="font-semibold underline">
            Ir al panel
          </Link>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/cuenta/perfil"
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
        >
          Editar perfil
        </Link>
        <Link
          href="/cuenta/direcciones"
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
        >
          Mis direcciones
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-black text-zinc-950">Mis pedidos</h2>
        {orders.length === 0 ? (
          <div className="mt-4 rounded-lg border border-zinc-200 p-8 text-center">
            <p className="text-sm text-zinc-600">Aun no tienes pedidos.</p>
            <Link
              href="/productos"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4"
              >
                <div>
                  <Link
                    href={`/pedido/${order.orderNumber}`}
                    className="text-sm font-bold text-zinc-950 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">
                    {dateFormatter.format(order.createdAt)} · {order.itemCount} art.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-950">
                    {formatMXN(order.total)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {labelFor(orderStatusLabels, order.status)} ·{" "}
                    {labelFor(paymentStatusLabels, order.paymentStatus)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
