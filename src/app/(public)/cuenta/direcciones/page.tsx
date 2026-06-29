import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteAddressAction } from "@/app/(public)/cuenta/direcciones/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { getCustomerAddresses } from "@/services/address.service";
import { getCurrentUser } from "@/services/account.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Mis direcciones",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/cuenta/direcciones");
  }

  const addresses = await getCustomerAddresses();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cuenta" className="text-sm font-semibold underline">
        ← Mi cuenta
      </Link>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-normal text-zinc-950">
          Mis direcciones
        </h1>
        <Link
          href="/cuenta/direcciones/nueva"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
        >
          Nueva
        </Link>
      </div>

      {addresses.length === 0 ? (
        <p className="mt-8 rounded-lg border border-zinc-200 p-8 text-center text-sm text-zinc-600">
          Aun no tienes direcciones guardadas.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-zinc-950">
                    {address.label ? `${address.label} · ` : ""}
                    {address.fullName}
                    {address.isDefault ? (
                      <span className="ml-2 rounded bg-zinc-950 px-2 py-0.5 text-xs font-bold text-white">
                        Predeterminada
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">{address.address}</p>
                  <p className="text-sm text-zinc-600">
                    {[address.postalCode, address.city, address.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-zinc-500">{address.phone}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-sm">
                <Link
                  href={`/cuenta/direcciones/${address.id}`}
                  className="font-semibold underline"
                >
                  Editar
                </Link>
                <form action={deleteAddressAction}>
                  <input type="hidden" name="id" value={address.id} />
                  <ConfirmSubmitButton
                    className="font-semibold text-zinc-500 underline hover:text-red-600"
                    message="Eliminar esta direccion?"
                  >
                    Eliminar
                  </ConfirmSubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
