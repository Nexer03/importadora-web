import Link from "next/link";

import { logoutAction } from "@/app/(admin)/admin/actions/auth.actions";

type AdminHeaderProps = {
  adminUser: {
    name: string | null;
    email: string;
  };
};

export function AdminHeader({ adminUser }: AdminHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Panel administrador
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Contenido, catalogo y configuracion base.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="text-sm">
            <p className="font-bold text-zinc-950">
              {adminUser.name ?? "Admin"}
            </p>
            <p className="text-zinc-500">{adminUser.email}</p>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
          >
            Ver tienda
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
