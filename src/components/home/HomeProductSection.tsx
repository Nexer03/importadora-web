import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PublicProductCard } from "@/types/catalog";

type HomeProductSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  products: PublicProductCard[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function HomeProductSection({
  eyebrow,
  title,
  description,
  href,
  products,
  emptyTitle,
  emptyDescription,
}: HomeProductSectionProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
      />
      <ProductGrid
        products={products}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </section>
  );
}
