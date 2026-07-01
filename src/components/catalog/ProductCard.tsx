import Link from "next/link";

import type { PublicProductCard } from "@/types/catalog";
import { formatMXN } from "@/utils/format";

type ProductCardProps = {
  product: PublicProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-950">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.primaryImage ? (
            <img
              src={product.primaryImage.url}
              alt={product.primaryImage.altText ?? product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-100 px-4 text-center">
              <div className="h-16 w-16 rounded-full border border-zinc-300 bg-white" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Allure Selection
              </p>
            </div>
          )}
          {product.hasDiscount && product.discountPercentage ? (
            <span className="absolute left-3 top-3 rounded-md bg-zinc-950 px-2 py-1 text-xs font-bold text-white">
              -{product.discountPercentage}%
            </span>
          ) : null}
          {product.isNew ? (
            <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-zinc-950">
              Nuevo
            </span>
          ) : null}
          {product.stockAvailable <= 0 ? (
            <span className="absolute inset-x-0 bottom-0 bg-zinc-950/80 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white">
              Agotado
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {product.category.name}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-zinc-950">
              <Link href={`/producto/${product.slug}`}>{product.name}</Link>
            </h3>
          </div>
        </div>
        {product.shortDescription ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
            {product.shortDescription}
          </p>
        ) : null}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-zinc-950">
              {formatMXN(product.price)}
            </span>
            {product.hasDiscount && product.discountPrice ? (
              <span className="text-sm text-zinc-500 line-through">
                {formatMXN(product.basePrice)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-medium text-zinc-500">
            {product.stockAvailable > 0
              ? `${product.stockAvailable} disponibles`
              : "Sin stock por ahora"}
          </p>
        </div>
      </div>
    </article>
  );
}
