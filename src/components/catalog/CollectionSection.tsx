import type { PublicProductCard } from "@/types/catalog";

import { ProductGrid } from "./ProductGrid";
import { SectionHeader } from "../ui/SectionHeader";

type CollectionSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  products: PublicProductCard[];
};

export function CollectionSection({
  eyebrow,
  title,
  description,
  href,
  products,
}: CollectionSectionProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
      />
      <ProductGrid products={products} />
    </section>
  );
}
