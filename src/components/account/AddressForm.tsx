import type { AddressDTO } from "@/services/address.service";

type AddressFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  address?: AddressDTO;
  submitLabel: string;
};

const labelClass = "text-xs font-bold uppercase tracking-wide text-zinc-500";
const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";

export function AddressForm({ action, address, submitLabel }: AddressFormProps) {
  return (
    <form action={action} className="grid gap-4">
      {address ? <input type="hidden" name="id" value={address.id} /> : null}

      <div>
        <label className={labelClass} htmlFor="label">
          Etiqueta (opcional)
        </label>
        <input
          id="label"
          name="label"
          defaultValue={address?.label ?? ""}
          placeholder="Casa, oficina…"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">
            Nombre de quien recibe
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            defaultValue={address?.fullName ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Telefono
          </label>
          <input
            id="phone"
            name="phone"
            required
            defaultValue={address?.phone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="address">
          Direccion
        </label>
        <input
          id="address"
          name="address"
          required
          defaultValue={address?.address ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="postalCode">
            Codigo postal
          </label>
          <input
            id="postalCode"
            name="postalCode"
            required
            defaultValue={address?.postalCode ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">
            Ciudad
          </label>
          <input
            id="city"
            name="city"
            required
            defaultValue={address?.city ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="state">
            Estado
          </label>
          <input
            id="state"
            name="state"
            required
            defaultValue={address?.state ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="reference">
          Referencia (opcional)
        </label>
        <input
          id="reference"
          name="reference"
          defaultValue={address?.reference ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault ?? false}
        />
        Usar como direccion predeterminada
      </label>

      <button
        type="submit"
        className="h-11 w-fit rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
