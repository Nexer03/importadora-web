import Link from "next/link";

import { signOutAction } from "@/app/(public)/auth-actions";
import { SearchBox } from "@/components/layout/SearchBox";
import { auth } from "@/lib/auth";
import { getCartItemCount } from "@/services/cart.service";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/coleccion/novedades", label: "Novedades" },
  { href: "/productos?audience=dama", label: "Dama" },
  { href: "/productos?audience=caballero", label: "Caballero" },
  { href: "/productos?audience=unisex", label: "Unisex" },
  { href: "/productos?collection=descuentos", label: "Descuentos" },
  { href: "/productos", label: "Productos" },
];

export async function SiteHeader() {
  const [itemCount, session] = await Promise.all([
    getCartItemCount(),
    auth(),
  ]);
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? user?.email;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-normal text-zinc-950"
          >
            Importadora
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/cuenta"
                  className="hidden text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 sm:inline"
                >
                  Hola, {firstName}
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
                  >
                    Salir
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/cuenta"
                className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
              >
                Iniciar sesion
              </Link>
            )}
            <Link
              href="/carrito"
              aria-label={`Carrito con ${itemCount} productos`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Carrito ({itemCount})
            </Link>
          </div>
        </div>
        <SearchBox />
        <nav
          aria-label="Principal"
          className="-mx-4 flex gap-1 overflow-x-auto px-4 text-sm font-semibold text-zinc-700 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
