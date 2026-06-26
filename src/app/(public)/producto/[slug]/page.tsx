import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductDetail } from "@/services/catalog.service";
import {
  buildProductMetadata,
  getSiteUrl,
} from "@/services/seo.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      product.shortDescription ??
      `${product.name} en Importadora`,
    image: product.images.map((image) => image.url),
    sku: product.sku ?? product.slug,
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/producto/${product.slug}`,
      priceCurrency: "MXN",
      price: product.price.toFixed(2),
      availability:
        product.stockAvailable > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <section className="grid gap-4">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].altText ?? product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-zinc-100">
                <div className="h-28 w-28 rounded-full border border-zinc-300 bg-white" />
              </div>
            )}
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
                >
                  <img
                    src={image.url}
                    alt={image.altText ?? product.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {product.category.name} / {product.audience.name}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-zinc-950 sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription ? (
            <p className="mt-4 text-base leading-7 text-zinc-600">
              {product.shortDescription}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-zinc-950">
              {formatMXN(product.price)}
            </span>
            {product.hasDiscount && product.discountPrice ? (
              <>
                <span className="text-lg text-zinc-500 line-through">
                  {formatMXN(product.basePrice)}
                </span>
                <span className="rounded-md bg-zinc-950 px-2 py-1 text-xs font-bold text-white">
                  -{product.discountPercentage}%
                </span>
              </>
            ) : null}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="h-12 rounded-md bg-zinc-950 px-5 text-sm font-bold text-white"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              className="h-12 rounded-md border border-zinc-300 px-5 text-sm font-bold text-zinc-950"
            >
              Comprar ahora
            </button>
          </div>

          <div className="mt-8 rounded-lg border border-zinc-200 p-5">
            <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Disponibilidad
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {product.stockAvailable > 0
                ? `${product.stockAvailable} piezas visibles en inventario.`
                : "Stock por confirmar antes de compra."}
            </p>
          </div>

          {product.variants.length > 0 ? (
            <div className="mt-6 rounded-lg border border-zinc-200 p-5">
              <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
                Variantes
              </p>
              <div className="mt-4 grid gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-zinc-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-zinc-950">
                        {variant.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {[variant.color, variant.size, variant.sku]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    </div>
                    <p className="font-semibold text-zinc-950">
                      {formatMXN(variant.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 rounded-lg border border-zinc-200 p-5">
            <p className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Entrega y envio
            </p>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-zinc-600">
              <p>Entrega local disponible en zonas definidas por la tienda.</p>
              <p>Envio nacional con costo calculado en una fase posterior.</p>
              <p>Facturacion disponible bajo solicitud.</p>
            </div>
          </div>

          {product.description ? (
            <div className="mt-6">
              <h2 className="text-lg font-black text-zinc-950">Descripcion</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-600">
                {product.description}
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
