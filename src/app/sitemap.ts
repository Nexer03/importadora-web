import type { MetadataRoute } from "next";

import { legalNavLinks } from "@/content/legal";
import { getActiveCategories } from "@/repositories/category.repository";
import { getActiveCollections } from "@/repositories/collection.repository";
import { getSitemapProducts } from "@/repositories/product.repository";
import { getSiteUrl } from "@/services/seo.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const [categories, collections, products] = await Promise.all([
    getActiveCategories(),
    getActiveCollections(),
    getSitemapProducts(),
  ]);

  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/productos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories
      .filter((category) => category.indexable)
      .map((category) => ({
        url: `${siteUrl}/categoria/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...collections
      .filter((collection) => collection.indexable)
      .map((collection) => ({
        url: `${siteUrl}/coleccion/${collection.slug}`,
        lastModified: collection.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...products.map((product) => ({
      url: `${siteUrl}/producto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...legalNavLinks.map((link) => ({
      url: `${siteUrl}${link.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
