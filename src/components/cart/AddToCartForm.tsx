"use client";

import { useActionState, useState } from "react";

import {
  addToCartAction,
  buyNowAction,
  type CartActionState,
} from "@/app/(public)/carrito/actions";
import type { PublicProductVariant } from "@/types/catalog";
import { formatMXN } from "@/utils/format";

const INITIAL_STATE: CartActionState = { ok: false };

type AddToCartFormProps = {
  variants: PublicProductVariant[];
};

export function AddToCartForm({ variants }: AddToCartFormProps) {
  const sellableVariants = variants.filter((variant) => variant.stockAvailable > 0);
  const [state, formAction, pending] = useActionState(
    addToCartAction,
    INITIAL_STATE
  );
  const [selectedId, setSelectedId] = useState(
    sellableVariants[0]?.id ?? variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedId) ?? null;
  const outOfStock =
    !selectedVariant || selectedVariant.stockAvailable <= 0;
  const maxQuantity = selectedVariant
    ? Math.min(selectedVariant.stockAvailable, 99)
    : 1;

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="variantId" value={selectedId} />

      {variants.length > 1 ? (
        <div>
          <label
            htmlFor="cart-variant"
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
          >
            Variante
          </label>
          <select
            id="cart-variant"
            value={selectedId}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setQuantity(1);
            }}
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-950"
          >
            {variants.map((variant) => (
              <option
                key={variant.id}
                value={variant.id}
                disabled={variant.stockAvailable <= 0}
              >
                {variant.name}
                {variant.stockAvailable <= 0 ? " (agotado)" : ""} —{" "}
                {formatMXN(variant.price)}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-end gap-4">
        <div>
          <label
            htmlFor="cart-quantity"
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
          >
            Cantidad
          </label>
          <input
            id="cart-quantity"
            name="quantity"
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!Number.isFinite(next)) {
                return;
              }
              setQuantity(Math.min(Math.max(Math.trunc(next), 1), maxQuantity));
            }}
            disabled={outOfStock}
            className="mt-2 h-11 w-24 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          disabled={pending || outOfStock}
          className="h-12 rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition disabled:opacity-50"
        >
          {pending ? "Agregando…" : "Agregar al carrito"}
        </button>
        <button
          type="submit"
          formAction={buyNowAction}
          disabled={pending || outOfStock}
          className="h-12 rounded-md border border-zinc-300 px-5 text-sm font-bold text-zinc-950 transition disabled:opacity-50"
        >
          Comprar ahora
        </button>
      </div>

      <div aria-live="polite" className="min-h-5 text-sm">
        {outOfStock ? (
          <p className="font-semibold text-zinc-500">
            Producto sin stock disponible.
          </p>
        ) : state.error ? (
          <p className="font-semibold text-red-600">{state.error}</p>
        ) : state.ok ? (
          <p className="font-semibold text-emerald-700">
            Agregado al carrito.{" "}
            <a href="/carrito" className="underline">
              Ver carrito
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
