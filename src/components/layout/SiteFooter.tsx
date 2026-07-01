import Link from "next/link";

import { legalNavLinks } from "@/content/legal";

type SiteFooterProps = {
  settings?: Record<string, string>;
};

export function SiteFooter({ settings = {} }: SiteFooterProps) {
  const storeName = settings.store_name ?? "Allure Selection";

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/icono-transparent.png"
              alt=""
              aria-hidden="true"
              className="h-10 w-auto"
            />
            <p className="font-serif text-lg font-semibold uppercase tracking-[0.2em]">
              {storeName}
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
            Accesorios importados con catalogo variable, entrega local y envio
            nacional.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Comprar
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/productos" className="hover:text-zinc-300">
              Productos
            </Link>
            <Link href="/coleccion/novedades" className="hover:text-zinc-300">
              Novedades
            </Link>
            <Link href="/productos?collection=descuentos" className="hover:text-zinc-300">
              Descuentos
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Informacion
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {legalNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 px-4 py-5 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {storeName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
