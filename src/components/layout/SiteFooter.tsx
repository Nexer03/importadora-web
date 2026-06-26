import Link from "next/link";

type SiteFooterProps = {
  settings?: Record<string, string>;
};

export function SiteFooter({ settings = {} }: SiteFooterProps) {
  const storeName = settings.store_name ?? "Importadora";

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <p className="text-lg font-black uppercase tracking-normal">
            {storeName}
          </p>
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
            Soporte
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-300">
            <span>Envio nacional</span>
            <span>Entrega local</span>
            <span>Facturacion disponible</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
