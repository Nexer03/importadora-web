import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { isGoogleLoginEnabled } from "@/lib/auth";
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
  let redirectTarget: string | null = null;

  try {
    await requireAdminAccess();
    redirectTarget = callbackUrl;
  } catch (accessError) {
    if (!isAdminAccessError(accessError)) {
      throw accessError;
    }
    // Usuario autenticado pero sin rol admin (cliente Google): va al inicio.
    if (accessError.reason === "FORBIDDEN") {
      redirectTarget = "/";
    }
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          Importadora
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Ingresa con tu correo y contrasena o con Google.
        </p>
        <div className="mt-6">
          <LoginForm
            callbackUrl={callbackUrl}
            initialError={error ? "Credenciales invalidas" : undefined}
            googleEnabled={isGoogleLoginEnabled}
          />
        </div>
        <p className="mt-5 text-center text-sm text-zinc-600">
          No tienes cuenta?{" "}
          <Link href="/cuenta/registro" className="font-semibold underline">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}
