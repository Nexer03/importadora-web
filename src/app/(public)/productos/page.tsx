import type { Metadata } from "next";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";

import {
  getCatalogFilters,
  getProductsPage,
} from "@/services/catalog.service";
import type { ProductListParams } from "@/types/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductsSearchParams = {
  category?: string | string[];
  collection?: string | string[];
  audience?: string | string[];
  q?: string | string[];
  page?: string | string[];
  sort?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
};

const sortValues = ["newest", "price_asc", "price_desc"] as const;

function parsePositiveNumber(value?: string) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

type ProductsPageProps = {
  searchParams: Promise<ProductsSearchParams>;
};

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function buildProductParams(searchParams: ProductsSearchParams): ProductListParams {
  const rawPage = Number(getParam(searchParams.page));
  const rawSort = getParam(searchParams.sort);
  const sort = sortValues.includes(rawSort as (typeof sortValues)[number])
    ? (rawSort as ProductListParams["sort"])
    : undefined;
  return {
    category: getParam(searchParams.category),
    collection: getParam(searchParams.collection),
    audience: getParam(searchParams.audience),
    q: getParam(searchParams.q),
    page: Number.isFinite(rawPage) && rawPage > 0 ? Math.trunc(rawPage) : 1,
    sort,
    minPrice: parsePositiveNumber(getParam(searchParams.minPrice)),
    maxPrice: parsePositiveNumber(getParam(searchParams.maxPrice)),
  };
}

function buildPageHref(params: ProductListParams, page: number): string {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.collection) search.set("collection", params.collection);
  if (params.audience) search.set("audience", params.audience);
  if (params.q) search.set("q", params.q);
  if (params.sort) search.set("sort", params.sort);
  if (params.minPrice != null) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `/productos?${query}` : "/productos";
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = buildProductParams(await searchParams);
  const filtered = params.category ?? params.collection ?? params.audience;

  return {
    title: filtered ? `Productos ${filtered}` : "Productos",
    description:
      "Catalogo publico de accesorios importados con filtros por categoria, publico y coleccion.",
    alternates: {
      canonical: "/productos",
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = buildProductParams(await searchParams);
  const [filters, productsPage] = await Promise.all([
    getCatalogFilters(),
    getProductsPage(params),
  ]);
  const products = productsPage.products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Categorias
            </p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              {filters.categories.map((category) => (
                <a
                  key={category.id}
                  href={`/productos?category=${category.slug}`}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Publico
            </p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              {filters.audiences.map((audience) => (
                <a
                  key={audience.id}
                  href={`/productos?audience=${audience.slug}`}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                >
                  {audience.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Colecciones
            </p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              {filters.collections.map((collection) => (
                <a
                  key={collection.id}
                  href={`/productos?collection=${collection.slug}`}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                >
                  {collection.name}
                </a>
              ))}
            </div>
          </div>
        </aside>
        <section className="space-y-6">
          <SectionHeader
            eyebrow="Catalogo"
            title={params.q ? `Resultados para "${params.q}"` : "Productos"}
            description={
              params.q
                ? `${productsPage.total} ${
                    productsPage.total === 1 ? "resultado" : "resultados"
                  }.`
                : "Accesorios importados con filtros por categoria, publico y coleccion."
            }
          />

          <form
            method="GET"
            className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-3"
          >
            {params.category ? (
              <input type="hidden" name="category" value={params.category} />
            ) : null}
            {params.collection ? (
              <input type="hidden" name="collection" value={params.collection} />
            ) : null}
            {params.audience ? (
              <input type="hidden" name="audience" value={params.audience} />
            ) : null}
            {params.q ? <input type="hidden" name="q" value={params.q} /> : null}
            <label className="text-xs font-semibold text-zinc-600">
              Ordenar
              <select
                name="sort"
                defaultValue={params.sort ?? "newest"}
                className="mt-1 block h-9 rounded-md border border-zinc-300 px-2 text-sm text-zinc-950"
              >
                <option value="newest">Mas recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-zinc-600">
              Precio min
              <input
                type="number"
                name="minPrice"
                min="0"
                defaultValue={params.minPrice ?? ""}
                className="mt-1 block h-9 w-24 rounded-md border border-zinc-300 px-2 text-sm text-zinc-950"
              />
            </label>
            <label className="text-xs font-semibold text-zinc-600">
              Precio max
              <input
                type="number"
                name="maxPrice"
                min="0"
                defaultValue={params.maxPrice ?? ""}
                className="mt-1 block h-9 w-24 rounded-md border border-zinc-300 px-2 text-sm text-zinc-950"
              />
            </label>
            <button
              type="submit"
              className="h-9 rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
            >
              Aplicar
            </button>
          </form>

          <ProductGrid
            products={products}
            emptyTitle="No hay productos"
            emptyDescription="No encontramos productos con estos filtros. Intenta con otra busqueda o categoria."
          />

          {productsPage.totalPages > 1 ? (
            <nav
              aria-label="Paginacion"
              className="flex items-center justify-between border-t border-zinc-200 pt-6"
            >
              {productsPage.page > 1 ? (
                <Link
                  href={buildPageHref(params, productsPage.page - 1)}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
                >
                  Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-zinc-600">
                Pagina {productsPage.page} de {productsPage.totalPages}
              </span>
              {productsPage.page < productsPage.totalPages ? (
                <Link
                  href={buildPageHref(params, productsPage.page + 1)}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
                >
                  Siguiente
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </section>
      </div>
    </div>
  );
}
