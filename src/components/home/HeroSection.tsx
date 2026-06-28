import Link from "next/link";

import type { HomeSectionDTO, PublicProductCard } from "@/types/catalog";
import { formatMXN } from "@/utils/format";

type HeroSectionProps = {
  section?: HomeSectionDTO;
  featuredProduct?: PublicProductCard;
};

export function HeroSection({ section, featuredProduct }: HeroSectionProps) {
  const title =
    section?.title ?? "Accesorios importados para todos los dias";
  const subtitle =
    section?.subtitle ??
    "Novedades, descuentos y piezas seleccionadas para dama, caballero y estilo unisex.";
  const buttonText = section?.buttonText ?? "Ver productos";
  const buttonUrl = section?.buttonUrl ?? "/productos";
  const imageUrl = section?.imageUrl ?? featuredProduct?.primaryImage?.url;

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Catalogo mexicano
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-normal text-zinc-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={buttonUrl}
              className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 px-6 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              {buttonText}
            </Link>
            <Link
              href="/productos?collection=descuentos"
              className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-300 px-6 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
            >
              Ver descuentos
            </Link>
          </div>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={featuredProduct?.name ?? title}
              className="h-full min-h-80 w-full object-cover"
            />
          ) : (
            <div className="grid h-full min-h-80 grid-cols-2 gap-3 p-5">
              <div className="rounded-lg border border-zinc-200 bg-white p-5">
                <div className="h-24 rounded-md bg-zinc-200" />
                <p className="mt-5 text-sm font-bold text-zinc-950">
                  Nuevas piezas
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Bolsos, relojes, lentes y accesorios.
                </p>
              </div>
              <div className="mt-10 rounded-lg bg-zinc-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Precio desde
                </p>
                <p className="mt-3 text-3xl font-black">
                  {featuredProduct ? formatMXN(featuredProduct.price) : "$ MXN"}
                </p>
              </div>
              <div className="col-span-2 rounded-lg border border-zinc-200 bg-white p-5">
                <p className="text-sm font-bold text-zinc-950">
                  Entrega local y envio nacional
                </p>
                <div className="mt-4 h-2 rounded-full bg-zinc-200">
                  <div className="h-2 w-2/3 rounded-full bg-zinc-950" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
