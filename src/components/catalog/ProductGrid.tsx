import { EmptyState } from "@/components/ui/EmptyState";
import type { PublicProductCard } from "@/types/catalog";

import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: PublicProductCard[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProductGrid({
  products,
  emptyTitle = "Catalogo en preparacion",
  emptyDescription = "Aun no hay productos publicados para esta vista.",
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
