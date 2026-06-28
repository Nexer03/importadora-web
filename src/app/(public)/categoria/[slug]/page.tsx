import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCategoryPageData } from "@/services/catalog.service";
import { buildCategoryMetadata } from "@/services/seo.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data) {
    return {
      title: "Categoria no encontrada",
      robots: { index: false, follow: false },
    };
  }

  return buildCategoryMetadata(data.category);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Categoria"
        title={data.category.name}
        description={
          data.category.description ??
          "Productos publicados dentro de esta categoria."
        }
      />
      <ProductGrid
        products={data.products}
        emptyTitle="Categoria sin productos"
        emptyDescription="Esta categoria existe, pero todavia no tiene productos publicados."
      />
    </div>
  );
}
