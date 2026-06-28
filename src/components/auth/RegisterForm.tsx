"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { registerAction } from "@/app/(public)/cuenta/actions";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950";
const labelClass = "text-xs font-bold uppercase tracking-wide text-zinc-500";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("email", form.email);
      formData.set("password", form.password);

      const result = await registerAction({ ok: false }, formData);
      if (!result.ok) {
        setError(result.error ?? "No se pudo crear la cuenta.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        // La cuenta se creo; si el auto-login falla, mandamos a iniciar sesion.
        router.push("/login?callbackUrl=/cuenta");
        return;
      }

      router.push("/cuenta");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-md border border-zinc-950 bg-white px-4 py-3 text-sm font-semibold text-zinc-950">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className={labelClass}>Nombre</span>
        <input
          type="text"
          value={form.name}
          onChange={update("name")}
          required
          autoComplete="name"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Correo</span>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          required
          autoComplete="email"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Contrasena</span>
        <input
          type="password"
          value={form.password}
          onChange={update("password")}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Minimo 8 caracteres"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Ya tienes cuenta?{" "}
        <Link href="/login?callbackUrl=/cuenta" className="font-semibold underline">
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}
