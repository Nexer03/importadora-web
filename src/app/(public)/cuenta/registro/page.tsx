import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/services/account.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta para comprar mas rapido y ver tus pedidos.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/cuenta");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-normal text-zinc-950">
        Crear cuenta
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Registra una cuenta para comprar mas rapido y dar seguimiento a tus
        pedidos.
      </p>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
