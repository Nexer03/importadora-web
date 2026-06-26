import type { Metadata } from "next";

import type {
  PublicCategory,
  PublicCollection,
  PublicProductDetail,
} from "@/types/catalog";

const DEFAULT_TITLE = "Importadora | Accesorios importados";
const DEFAULT_DESCRIPTION =
  "Accesorios importados para dama, caballero y estilo unisex con envio nacional y entrega local.";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function keywordsFromString(keywords: string | null) {
  return keywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function buildRobots(indexable = true): Metadata["robots"] {
  return {
    index: indexable,
    follow: indexable,
  };
}

export function buildDefaultMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: DEFAULT_TITLE,
      template: "%s | Importadora",
    },
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: siteUrl,
      siteName: "Importadora",
      locale: "es_MX",
      type: "website",
    },
    robots: buildRobots(true),
  };
}

export function buildProductMetadata(product: PublicProductDetail): Metadata {
  const title = product.seo.title ?? product.name;
  const description =
    product.seo.description ??
    product.shortDescription ??
    product.description ??
    DEFAULT_DESCRIPTION;
  const image = product.seo.ogImage ?? product.primaryImage?.url;

  return {
    title,
    description,
    keywords: keywordsFromString(product.seo.keywords),
    alternates: {
      canonical: product.seo.canonicalUrl ?? `/producto/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    robots: buildRobots(product.seo.indexable),
  };
}

export function buildCategoryMetadata(category: PublicCategory): Metadata {
  const title = category.seo.title ?? category.name;
  const description =
    category.seo.description ?? category.description ?? DEFAULT_DESCRIPTION;
  const image = category.seo.ogImage ?? category.imageUrl;

  return {
    title,
    description,
    keywords: keywordsFromString(category.seo.keywords),
    alternates: {
      canonical: `/categoria/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image, alt: category.name }] : undefined,
    },
    robots: buildRobots(category.seo.indexable),
  };
}

export function buildCollectionMetadata(
  collection: PublicCollection
): Metadata {
  const title = collection.seo.title ?? collection.name;
  const description =
    collection.seo.description ?? collection.description ?? DEFAULT_DESCRIPTION;
  const image = collection.seo.ogImage ?? collection.imageUrl;

  return {
    title,
    description,
    keywords: keywordsFromString(collection.seo.keywords),
    alternates: {
      canonical: `/coleccion/${collection.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image, alt: collection.name }] : undefined,
    },
    robots: buildRobots(collection.seo.indexable),
  };
}
