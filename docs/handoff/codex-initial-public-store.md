# Codex handoff: initial public store

## Implemented

- Prisma singleton for Next.js in `src/lib/prisma.ts`.
- Public catalog DTOs in `src/types/catalog.ts`.
- Repository layer for categories, audiences, collections, products, home sections and settings.
- Service layer for catalog data, home data, layout settings and SEO metadata helpers.
- Public API route handlers prepared for future mobile app consumption.
- Public responsive store shell with announcement bar, header, footer and cart placeholder.
- Home page with hero, quick access cards, new products, seasonal banner, discounts, featured products and benefits.
- Public catalog pages for product listing, category, collection and product detail.
- Basic dynamic metadata, robots, sitemap and Product JSON-LD.
- Build compatibility fix in `prisma.config.ts` by validating `DATABASE_URL` before passing it to Prisma config.

## Files created

- `src/lib/prisma.ts`
- `src/types/catalog.ts`
- `src/repositories/category.repository.ts`
- `src/repositories/audience.repository.ts`
- `src/repositories/collection.repository.ts`
- `src/repositories/product.repository.ts`
- `src/repositories/home.repository.ts`
- `src/repositories/settings.repository.ts`
- `src/services/catalog.service.ts`
- `src/services/home.service.ts`
- `src/services/seo.service.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/audiences/route.ts`
- `src/app/api/collections/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[slug]/route.ts`
- `src/app/api/home/route.ts`
- `src/app/(public)/layout.tsx`
- `src/app/(public)/productos/page.tsx`
- `src/app/(public)/categoria/[slug]/page.tsx`
- `src/app/(public)/coleccion/[slug]/page.tsx`
- `src/app/(public)/producto/[slug]/page.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/components/layout/AnnouncementBar.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/ProductGrid.tsx`
- `src/components/catalog/CategoryPills.tsx`
- `src/components/catalog/CollectionSection.tsx`
- `src/components/home/HeroSection.tsx`
- `src/components/home/PromoBanner.tsx`
- `src/components/home/HomeBenefits.tsx`
- `src/components/home/HomeProductSection.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/utils/format.ts`

## Files modified

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `prisma.config.ts`

No changes were made to `prisma/schema.prisma`, migrations or `.env`.

## API endpoints

- `GET /api/categories`
- `GET /api/audiences`
- `GET /api/collections`
- `GET /api/products`
- `GET /api/products?category=bolsos`
- `GET /api/products?collection=descuentos`
- `GET /api/products?audience=dama`
- `GET /api/products?q=reloj&limit=12`
- `GET /api/products/[slug]`
- `GET /api/home`

API responses use `NextResponse.json` and return `{ data: ... }` on success. Errors return generic messages without stack traces.

## Public pages

- `/`
- `/productos`
- `/categoria/[slug]`
- `/coleccion/[slug]`
- `/producto/[slug]`
- `/robots.txt`
- `/sitemap.xml`

## Data rules

- Public product queries only return `PUBLISHED` and `indexable` products.
- Product queries require active category and active audience.
- Collection filters require active collections.
- Limits are clamped in repositories to avoid heavy public queries.
- Services convert Prisma `Decimal` values to UI/API-safe numbers.
- Visible stock is the sum of active variants' `stockAvailable`.
- Product discount state and discount percentage are derived in the service layer.

## How to run

```bash
npm install
npm run db:seed
npm run dev
```

Open:

```txt
http://localhost:3000
```

## How to validate

```bash
npm run build
```

Current validation result:

```txt
npm run build: passed
```

## How to test API quickly

```bash
curl http://localhost:3000/api/home
curl http://localhost:3000/api/categories
curl http://localhost:3000/api/products
curl "http://localhost:3000/api/products?audience=dama&limit=8"
```

## Not implemented yet

- Real cart state.
- Checkout flow.
- Payments.
- Mercado Pago.
- Login/auth flows.
- Admin panel UI/actions.
- Full faceted filtering UX.
- Product image upload/management.
- Order creation.
- Shipping quote calculation.

## Next developer checklist

- Add admin CRUD for products, variants, images, collections and home sections.
- Decide final `NEXT_PUBLIC_SITE_URL` for production metadata, sitemap and JSON-LD.
- Replace placeholders with real product images from admin uploads or CDN.
- Add pagination for `/productos` and `/api/products` before catalog volume grows.
- Add cart service and API contract before implementing checkout UI.
- Add integration tests for repository/service DTO transformations once fixtures are stable.
