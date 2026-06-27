import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import {
  isAdminAccessError,
  requireAdminAccess,
} from "@/services/admin.guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Login admin | Importadora",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getSafeCallbackUrl(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(getSingleParam(params.callbackUrl));
  const error = getSingleParam(params.error);
  let shouldRedirect = false;

  try {
    await requireAdminAccess();
    shouldRedirect = true;
  } catch (accessError) {
    if (!isAdminAccessError(accessError)) {
      throw accessError;
    }
  }

  if (shouldRedirect) {
    redirect(callbackUrl);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Panel administrador
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Ingresa con el usuario administrador para gestionar la tienda.
        </p>
        <div className="mt-6">
          <LoginForm
            callbackUrl={callbackUrl}
            initialError={error ? "Credenciales invalidas" : undefined}
          />
        </div>
      </section>
    </main>
  );
}
