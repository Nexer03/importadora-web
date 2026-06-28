"use client";

import { useActionState, useMemo, useState } from "react";

import {
  submitCheckoutAction,
  type CheckoutFormState,
} from "@/app/(public)/checkout/actions";
import type { PaymentMethodOption } from "@/services/payments/registry";
import type { DeliveryMethodDTO, ShippingOption } from "@/types/order";
import { formatMXN } from "@/utils/format";

const INITIAL_STATE: CheckoutFormState = {};

type CheckoutFormProps = {
  shippingOptions: ShippingOption[];
  subtotal: number;
  paymentMethods: PaymentMethodOption[];
  discountAmount: number;
  couponCode: string | null;
  freeShipping: boolean;
};

const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";
const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-zinc-500";

export function CheckoutForm({
  shippingOptions,
  subtotal,
  paymentMethods,
  discountAmount,
  couponCode,
  freeShipping,
}: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(
    submitCheckoutAction,
    INITIAL_STATE
  );
  const [method, setMethod] = useState<DeliveryMethodDTO>(
    shippingOptions[0]?.method ?? "NATIONAL_SHIPPING"
  );
  const [paymentProvider, setPaymentProvider] = useState(
    paymentMethods[0]?.provider ?? ""
  );

  const selectedOption = useMemo(
    () => shippingOptions.find((option) => option.method === method) ?? null,
    [shippingOptions, method]
  );
  const shippingCost = freeShipping ? 0 : selectedOption?.cost ?? 0;
  const total = subtotal - discountAmount + shippingCost;
  const needsAddress = method !== "LOCAL_PICKUP";

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-8">
        <fieldset className="grid gap-4 rounded-lg border border-zinc-200 p-5">
          <legend className="px-1 text-sm font-black uppercase tracking-wide text-zinc-950">
            Datos de contacto
          </legend>
          <div>
            <label className={labelClass} htmlFor="customerName">
              Nombre completo
            </label>
            <input id="customerName" name="customerName" required className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="customerEmail">
                Correo
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="customerPhone">
                Telefono
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                required
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="grid gap-3 rounded-lg border border-zinc-200 p-5">
          <legend className="px-1 text-sm font-black uppercase tracking-wide text-zinc-950">
            Metodo de entrega
          </legend>
          {shippingOptions.map((option) => (
            <label
              key={option.method}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 p-3 text-sm has-[:checked]:border-zinc-950"
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.method}
                checked={method === option.method}
                onChange={() => setMethod(option.method)}
                className="mt-1"
              />
              <span className="flex-1">
                <span className="flex items-center justify-between font-semibold text-zinc-950">
                  <span>{option.label}</span>
                  <span>{option.cost > 0 ? formatMXN(option.cost) : "Gratis"}</span>
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        {needsAddress ? (
          <fieldset className="grid gap-4 rounded-lg border border-zinc-200 p-5">
            <legend className="px-1 text-sm font-black uppercase tracking-wide text-zinc-950">
              Direccion de entrega
            </legend>
            <div>
              <label className={labelClass} htmlFor="shippingAddress">
                Direccion
              </label>
              <input
                id="shippingAddress"
                name="shippingAddress"
                required={needsAddress}
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="postalCode">
                  Codigo postal
                </label>
                <input id="postalCode" name="postalCode" required={needsAddress} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="city">
                  Ciudad
                </label>
                <input id="city" name="city" required={needsAddress} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="state">
                  Estado
                </label>
                <input id="state" name="state" required={needsAddress} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="addressReference">
                Referencia (opcional)
              </label>
              <input id="addressReference" name="addressReference" className={inputClass} />
            </div>
          </fieldset>
        ) : (
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Recoleccion local: la tienda te compartira el punto y horario de
            recoleccion despues de confirmar el pedido.
          </p>
        )}

        <fieldset className="grid gap-3 rounded-lg border border-zinc-200 p-5">
          <legend className="px-1 text-sm font-black uppercase tracking-wide text-zinc-950">
            Metodo de pago
          </legend>
          {paymentMethods.map((option) => (
            <label
              key={option.provider}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 p-3 text-sm font-semibold text-zinc-950 has-[:checked]:border-zinc-950"
            >
              <input
                type="radio"
                name="paymentProvider"
                value={option.provider}
                checked={paymentProvider === option.provider}
                onChange={() => setPaymentProvider(option.provider)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </div>

      <aside className="h-fit rounded-lg border border-zinc-200 p-5">
        <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
          Resumen
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-950">{formatMXN(subtotal)}</span>
        </div>
        {discountAmount > 0 ? (
          <div className="mt-2 flex items-center justify-between text-sm text-emerald-700">
            <span>Descuento{couponCode ? ` (${couponCode})` : ""}</span>
            <span className="font-semibold">-{formatMXN(discountAmount)}</span>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
          <span>Envio</span>
          <span className="font-semibold text-zinc-950">
            {shippingCost > 0
              ? formatMXN(shippingCost)
              : freeShipping
                ? "Gratis con cupon"
                : "Gratis"}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-base font-black text-zinc-950">
          <span>Total</span>
          <span>{formatMXN(total)}</span>
        </div>

        {state.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !paymentProvider}
          className="mt-5 h-12 w-full rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition disabled:opacity-60"
        >
          {pending ? "Redirigiendo al pago…" : "Continuar al pago"}
        </button>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Seras redirigido a la pasarela de pago segura. El stock queda
          reservado mientras pagas.
        </p>
      </aside>
    </form>
  );
}
