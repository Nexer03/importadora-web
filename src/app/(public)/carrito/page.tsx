import type { Metadata } from "next";
import Link from "next/link";

import { CartCouponForm } from "@/components/cart/CartCouponForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCart } from "@/services/cart.service";
import { formatMXN } from "@/utils/format";

import {
  removeCartItemAction,
  updateCartItemAction,
} from "./actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa los productos seleccionados antes de pagar.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Compra"
        title="Tu carrito"
        description="Los precios y el stock se confirman en el servidor antes de pagar."
      />

      {cart.isEmpty ? (
        <div className="mt-8 rounded-lg border border-zinc-200 p-8 text-center">
          <p className="text-base font-semibold text-zinc-950">
            Tu carrito esta vacio.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Agrega productos desde el catalogo para continuar.
          </p>
          <Link
            href="/productos"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="grid gap-4">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-zinc-200 p-4"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-[160px] flex-1">
                  <Link
                    href={`/producto/${item.productSlug}`}
                    className="text-sm font-bold text-zinc-950 hover:underline"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">
                    {[item.variantName, item.color, item.size]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatMXN(item.unitPrice)} c/u
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <form action={updateCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="hidden"
                      name="quantity"
                      value={item.quantity - 1}
                    />
                    <button
                      type="submit"
                      aria-label="Disminuir cantidad"
                      className="h-9 w-9 rounded-md border border-zinc-300 text-base font-bold text-zinc-950"
                    >
                      −
                    </button>
                  </form>
                  <span className="w-8 text-center text-sm font-semibold text-zinc-950">
                    {item.quantity}
                  </span>
                  <form action={updateCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="hidden"
                      name="quantity"
                      value={item.quantity + 1}
                    />
                    <button
                      type="submit"
                      aria-label="Aumentar cantidad"
                      disabled={item.quantity >= item.stockAvailable}
                      className="h-9 w-9 rounded-md border border-zinc-300 text-base font-bold text-zinc-950 disabled:opacity-40"
                    >
                      +
                    </button>
                  </form>
                </div>

                <div className="w-24 text-right text-sm font-bold text-zinc-950">
                  {formatMXN(item.lineTotal)}
                </div>

                <form action={removeCartItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-zinc-500 underline hover:text-red-600"
                  >
                    Quitar
                  </button>
                </form>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-zinc-200 p-5">
            <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Resumen
            </p>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
              <span>Productos ({cart.itemCount})</span>
              <span className="font-semibold text-zinc-950">
                {formatMXN(cart.subtotal)}
              </span>
            </div>
            {cart.coupon && cart.coupon.discountAmount > 0 ? (
              <div className="mt-2 flex items-center justify-between text-sm text-emerald-700">
                <span>Descuento ({cart.coupon.code})</span>
                <span className="font-semibold">
                  -{formatMXN(cart.coupon.discountAmount)}
                </span>
              </div>
            ) : null}
            <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
              <span>Envio</span>
              <span>
                {cart.coupon?.freeShipping
                  ? "Gratis con cupon"
                  : "Se calcula en el checkout"}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-base font-black text-zinc-950">
              <span>Subtotal</span>
              <span>{formatMXN(cart.total)}</span>
            </div>

            <CartCouponForm coupon={cart.coupon} />
            <Link
              href="/checkout"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
            >
              Continuar al checkout
            </Link>
            <p className="mt-2 text-center text-xs text-zinc-500">
              Pago seguro con PayPal o tarjeta. El envio se calcula en el
              checkout.
            </p>
            <Link
              href="/productos"
              className="mt-3 block text-center text-sm font-semibold text-zinc-600 underline"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
