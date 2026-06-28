import Link from "next/link";

type PromoBannerProps = {
  title?: string;
  description?: string;
  href?: string;
  actionLabel?: string;
};

export function PromoBanner({
  title = "Ofertas de temporada",
  description = "Precios especiales en productos seleccionados por tiempo limitado.",
  href = "/productos?collection=descuentos",
  actionLabel = "Explorar ofertas",
}: PromoBannerProps) {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-black tracking-normal">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
        >
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}
