import type { AdminCouponDTO } from "@/services/admin/coupon-admin.service";

type AdminCouponFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  coupon?: AdminCouponDTO;
  submitLabel: string;
};

const labelClass = "text-xs font-semibold uppercase tracking-wide text-zinc-500";
const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";

const discountTypeOptions = [
  { value: "PERCENTAGE", label: "Porcentaje (%)" },
  { value: "FIXED_AMOUNT", label: "Monto fijo ($)" },
  { value: "FREE_SHIPPING", label: "Envio gratis" },
];

function toDateTimeLocal(date: Date | null): string {
  if (!date) {
    return "";
  }
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AdminCouponForm({
  action,
  coupon,
  submitLabel,
}: AdminCouponFormProps) {
  return (
    <form action={action} className="grid max-w-2xl gap-5">
      {coupon ? <input type="hidden" name="id" value={coupon.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="code">
            Codigo
          </label>
          <input
            id="code"
            name="code"
            required
            defaultValue={coupon?.code ?? ""}
            className={`${inputClass} uppercase`}
            placeholder="VERANO10"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="discountType">
            Tipo de descuento
          </label>
          <select
            id="discountType"
            name="discountType"
            defaultValue={coupon?.discountType ?? "PERCENTAGE"}
            className={inputClass}
          >
            {discountTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Descripcion (opcional)
        </label>
        <input
          id="description"
          name="description"
          defaultValue={coupon?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="discountValue">
            Valor del descuento
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            step="0.01"
            min="0"
            defaultValue={coupon?.discountValue ?? 0}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Para porcentaje usa 0-100. Para envio gratis se ignora.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="minPurchaseAmount">
            Compra minima (opcional)
          </label>
          <input
            id="minPurchaseAmount"
            name="minPurchaseAmount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={coupon?.minPurchaseAmount ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="startsAt">
            Inicia (opcional)
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(coupon?.startsAt ?? null)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="endsAt">
            Termina (opcional)
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(coupon?.endsAt ?? null)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="maxUses">
            Limite de usos (opcional)
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min="1"
            step="1"
            defaultValue={coupon?.maxUses ?? ""}
            className={inputClass}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-zinc-950">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={coupon ? coupon.isActive : true}
          />
          Activo
        </label>
      </div>

      <button
        type="submit"
        className="h-11 w-fit rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
