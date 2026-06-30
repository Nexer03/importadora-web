import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { updateAddressAction } from "@/app/(public)/cuenta/direcciones/actions";
import { AddressForm } from "@/components/account/AddressForm";
import { getCustomerAddress } from "@/services/address.service";
import { getCurrentUser } from "@/services/account.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Editar direccion",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditAddressPage({ params, searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/cuenta/direcciones");
  }
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const address = await getCustomerAddress(id);

  if (!address) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cuenta/direcciones" className="text-sm font-semibold underline">
        ← Mis direcciones
      </Link>
      <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950">
        Editar direccion
      </h1>
      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
        <AddressForm
          action={updateAddressAction}
          address={address}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
