import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PasswordForm } from "@/components/account/PasswordForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import {
  customerHasPassword,
  getCurrentUser,
} from "@/services/account.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/cuenta/perfil");
  }

  const hasPassword = await customerHasPassword();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cuenta" className="text-sm font-semibold underline">
        ← Mi cuenta
      </Link>
      <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950">
        Editar perfil
      </h1>

      <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-zinc-950">Datos</h2>
        <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
        <div className="mt-5">
          <ProfileForm defaultName={user.name ?? ""} />
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-zinc-950">
          {hasPassword ? "Cambiar contrasena" : "Crear contrasena"}
        </h2>
        <div className="mt-5">
          <PasswordForm hasPassword={hasPassword} />
        </div>
      </section>
    </div>
  );
}
