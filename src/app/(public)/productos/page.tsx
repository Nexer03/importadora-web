import type { Metadata } from "next";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getCatalogFilters,
  getProductsList,
} from "@/services/catalog.service";
import type { ProductListParams } from "@/types/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductsSearchParams = {
  category?: string | string[];
  collection?: string | string[];
  audience?: string | string[];
  q?: string | string[];
};

type ProductsPageProps = {
  searchParams: Promise<ProductsSearchParams>;
};

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function buildProductParams(searchParams: ProductsSearchParams) {
  const params: ProductListParams = {
    category: getParam(searchParams.category),
    collection: getParam(searchParams.collection),
    audience: getParam(searchParams.audience),
    q: getParam(searchParams.q),
    limit: 36,
  };

  return params;
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
  const [filters, products] = await Promise.all([
    getCatalogFilters(),
    getProductsList(params),
  ]);

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
            title="Productos"
            description="Listado inicial preparado para filtros, busqueda y consumo desde API movil."
          />
          <ProductGrid
            products={products}
            emptyTitle="No hay productos publicados"
            emptyDescription="Publica productos en estado PUBLISHED para que aparezcan en el catalogo."
          />
        </section>
      </div>
    </div>
  );
}
