import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCollectionPageData } from "@/services/catalog.service";
import { buildCollectionMetadata } from "@/services/seo.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollectionPageData(slug);

  if (!data) {
    return {
      title: "Coleccion no encontrada",
      robots: { index: false, follow: false },
    };
  }

  return buildCollectionMetadata(data.collection);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const data = await getCollectionPageData(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Coleccion"
        title={data.collection.name}
        description={
          data.collection.description ??
          "Seleccion curada de productos publicados."
        }
      />
      <ProductGrid
        products={data.products}
        emptyTitle="Coleccion sin productos"
        emptyDescription="Esta coleccion existe, pero todavia no tiene productos publicados."
      />
    </div>
  );
}
