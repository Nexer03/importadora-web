import { CategoryPills } from "@/components/catalog/CategoryPills";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeProductSection } from "@/components/home/HomeProductSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { getHomePageData } from "@/services/home.service";
import { buildDefaultMetadata, getSiteUrl } from "@/services/seo.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata() {
  return buildDefaultMetadata();
}

export default async function HomePage() {
  const data = await getHomePageData();
  const hero = data.sections.find((section) => section.type === "HERO");
  const banner = data.sections.find((section) => section.type === "BANNER");
  const featuredProduct =
    data.featuredProducts[0] ?? data.newProducts[0] ?? data.discountedProducts[0];

  const quickLinks = [
    {
      href: "/productos?audience=dama",
      label: "Dama",
      description: "Seleccion para looks practicos y de uso diario.",
    },
    {
      href: "/productos?audience=caballero",
      label: "Caballero",
      description: "Accesorios urbanos, utiles y faciles de combinar.",
    },
    {
      href: "/productos?audience=unisex",
      label: "Unisex",
      description: "Piezas versatiles para cualquier estilo.",
    },
    {
      href: "/productos?collection=descuentos",
      label: "Descuentos",
      description: "Precios especiales en productos seleccionados.",
    },
  ];

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const storeName = data.settings.store_name ?? "Allure Selection";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: storeName,
        url: siteUrl,
      },
      {
        "@type": "WebSite",
        name: storeName,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/productos?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnnouncementBar message={data.settings.announcement_bar} />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection section={hero} featuredProduct={featuredProduct} />
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CategoryPills items={quickLinks} />
        </section>
        <HomeProductSection
          eyebrow="Recien llegado"
          title="Novedades"
          description="Lo mas reciente de nuestro catalogo."
          href="/coleccion/novedades"
          products={data.newProducts}
          emptyTitle="Novedades en camino"
          emptyDescription="Muy pronto agregaremos productos nuevos."
        />
        <PromoBanner
          title={banner?.title ?? undefined}
          description={banner?.subtitle ?? undefined}
          href={banner?.buttonUrl ?? undefined}
          actionLabel={banner?.buttonText ?? undefined}
        />
        <HomeProductSection
          eyebrow="Precio especial"
          title="Descuentos"
          description="Productos con precio especial por tiempo limitado."
          href="/productos?collection=descuentos"
          products={data.discountedProducts}
          emptyTitle="Sin descuentos activos"
          emptyDescription="Por ahora no hay productos con descuento. Vuelve pronto."
        />
        <HomeProductSection
          eyebrow="Seleccion"
          title="Productos destacados"
          description="Nuestra seleccion recomendada."
          href="/productos"
          products={data.featuredProducts}
          emptyTitle="Proximamente"
          emptyDescription="Pronto destacaremos productos en esta seccion."
        />
        <HomeBenefits />
      </main>
      <SiteFooter settings={data.settings} />
    </>
  );
}
