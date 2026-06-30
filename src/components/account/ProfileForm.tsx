"use client";

import { useActionState } from "react";

import {
  updateProfileAction,
  type AccountActionState,
} from "@/app/(public)/cuenta/perfil/actions";

const INITIAL: AccountActionState = { ok: false };

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950";
const labelClass = "text-xs font-bold uppercase tracking-wide text-zinc-500";

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, INITIAL);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className={labelClass}>Nombre</span>
        <input
          name="name"
          defaultValue={defaultName}
          required
          minLength={2}
          className={inputClass}
        />
      </label>
      {state.error ? (
        <p className="text-sm font-semibold text-red-600">{state.error}</p>
      ) : null}
      {state.ok && state.message ? (
        <p className="text-sm font-semibold text-emerald-700">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
