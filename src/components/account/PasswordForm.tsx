"use client";

import { useActionState } from "react";

import {
  changePasswordAction,
  type AccountActionState,
} from "@/app/(public)/cuenta/perfil/actions";

const INITIAL: AccountActionState = { ok: false };

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950";
const labelClass = "text-xs font-bold uppercase tracking-wide text-zinc-500";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState(changePasswordAction, INITIAL);

  return (
    <form action={action} className="space-y-4">
      {hasPassword ? (
        <label className="block">
          <span className={labelClass}>Contrasena actual</span>
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>
      ) : (
        <p className="text-sm text-zinc-600">
          Tu cuenta inicio sesion con Google. Puedes crear una contrasena para
          entrar tambien con tu correo.
        </p>
      )}
      <label className="block">
        <span className={labelClass}>Nueva contrasena</span>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="Minimo 8 caracteres"
        />
      </label>
      <label className="block">
        <span className={labelClass}>Confirmar contrasena</span>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
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
        {pending ? "Guardando…" : hasPassword ? "Cambiar contrasena" : "Crear contrasena"}
      </button>
    </form>
  );
}
