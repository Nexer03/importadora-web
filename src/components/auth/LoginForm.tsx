"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  callbackUrl: string;
  initialError?: string;
};

export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        redirectTo: callbackUrl,
      });

      if (!result?.ok) {
        setError("Credenciales invalidas");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-md border border-zinc-950 bg-white px-4 py-3 text-sm font-semibold text-zinc-950">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          placeholder="admin@importadora.local"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isPending ? "Iniciando..." : "Iniciar sesion"}
      </button>

      <Link
        href="/"
        className="block text-center text-sm font-semibold text-zinc-600 underline"
      >
        Volver al inicio
      </Link>
    </form>
  );
}
