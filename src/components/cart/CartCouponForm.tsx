"use client";

import { useActionState } from "react";

import {
  applyCouponAction,
  removeCouponAction,
  type CouponActionState,
} from "@/app/(public)/carrito/actions";
import type { CartCouponDTO } from "@/types/cart";

const INITIAL_STATE: CouponActionState = { ok: false };

type CartCouponFormProps = {
  coupon: CartCouponDTO | null;
};

export function CartCouponForm({ coupon }: CartCouponFormProps) {
  const [state, formAction, pending] = useActionState(
    applyCouponAction,
    INITIAL_STATE
  );

  if (coupon) {
    return (
      <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-emerald-800">
            Cupon {coupon.code} aplicado
            {coupon.freeShipping ? " · envio gratis" : ""}
          </p>
          <form action={removeCouponAction}>
            <button
              type="submit"
              className="text-xs font-semibold text-emerald-800 underline"
            >
              Quitar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-4">
      <label
        htmlFor="coupon-code"
        className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
      >
        Cupon de descuento
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="coupon-code"
          name="code"
          placeholder="Codigo"
          className="h-10 flex-1 rounded-md border border-zinc-300 px-3 text-sm uppercase text-zinc-950 outline-none focus:border-zinc-950"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-md border border-zinc-950 px-4 text-sm font-bold text-zinc-950 disabled:opacity-50"
        >
          {pending ? "…" : "Aplicar"}
        </button>
      </div>
      {state.error ? (
        <p className="mt-2 text-sm font-semibold text-red-600">{state.error}</p>
      ) : null}
    </form>
  );
}
