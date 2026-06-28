"use client";

import { useState } from "react";

import type { AdminPromotionDTO } from "@/services/admin/promotion-admin.service";

type Target = { id: string; name: string };

type AdminPromotionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Target[];
  collections: Target[];
  promotion?: AdminPromotionDTO;
  submitLabel: string;
};

const labelClass = "text-xs font-semibold uppercase tracking-wide text-zinc-500";
const inputClass =
  "mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950";

function toDateTimeLocal(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function AdminPromotionForm({
  action,
  categories,
  collections,
  promotion,
  submitLabel,
}: AdminPromotionFormProps) {
  const [scope, setScope] = useState(promotion?.scope ?? "ALL");

  return (
    <form action={action} className="grid max-w-2xl gap-5">
      {promotion ? <input type="hidden" name="id" value={promotion.id} /> : null}

      <div>
        <label className={labelClass} htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={promotion?.name ?? ""}
          className={inputClass}
          placeholder="Descuento de temporada"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="discountType">
            Tipo de descuento
          </label>
          <select
            id="discountType"
            name="discountType"
            defaultValue={promotion?.discountType ?? "PERCENTAGE"}
            className={inputClass}
          >
            <option value="PERCENTAGE">Porcentaje (%)</option>
            <option value="FIXED_AMOUNT">Monto fijo ($)</option>
          </select>
        </div>
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
            defaultValue={promotion?.discountValue ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="scope">
          Aplica a
        </label>
        <select
          id="scope"
          name="scope"
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          className={inputClass}
        >
          <option value="ALL">Todos los productos</option>
          <option value="CATEGORY">Una categoria</option>
          <option value="COLLECTION">Una coleccion</option>
        </select>
      </div>

      {scope === "CATEGORY" ? (
        <div>
          <label className={labelClass} htmlFor="categoryId">
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={promotion?.categoryId ?? ""}
            className={inputClass}
          >
            <option value="">Selecciona…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {scope === "COLLECTION" ? (
        <div>
          <label className={labelClass} htmlFor="collectionId">
            Coleccion
          </label>
          <select
            id="collectionId"
            name="collectionId"
            defaultValue={promotion?.collectionId ?? ""}
            className={inputClass}
          >
            <option value="">Selecciona…</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="startsAt">
            Inicia (opcional)
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(promotion?.startsAt)}
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
            defaultValue={toDateTimeLocal(promotion?.endsAt)}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={promotion ? promotion.isActive : true}
        />
        Activa
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
