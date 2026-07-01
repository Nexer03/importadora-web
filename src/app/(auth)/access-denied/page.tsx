import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso denegado | Allure Selection",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Acceso denegado
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950">
          No tienes permisos de administrador
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Esta area esta reservada para usuarios administradores activos.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
        >
          Volver al login
        </Link>
      </section>
    </main>
  );
}
