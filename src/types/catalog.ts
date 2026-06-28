export type PublicSeoFields = {
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonicalUrl?: string | null;
  ogImage: string | null;
  indexable: boolean;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  seo: PublicSeoFields;
};

export type PublicAudience = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

export type PublicCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  seo: PublicSeoFields;
};

export type PublicProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type PublicProductVariant = {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  price: number;
  stockAvailable: number;
};

export type PublicProductCard = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  basePrice: number;
  discountPrice: number | null;
  price: number;
  hasDiscount: boolean;
  discountPercentage: number | null;
  isFeatured: boolean;
  isNew: boolean;
  primaryImage: PublicProductImage | null;
  category: PublicCategory;
  audience: PublicAudience;
  collections: PublicCollection[];
  stockAvailable: number;
};

export type PublicProductDetail = PublicProductCard & {
  description: string | null;
  images: PublicProductImage[];
  variants: PublicProductVariant[];
  seo: PublicSeoFields;
  sku: string | null;
};

export type HomeSectionTypeDTO =
  | "HERO"
  | "BANNER"
  | "PRODUCT_CAROUSEL"
  | "CATEGORY_GRID"
  | "COLLECTION_GRID"
  | "PROMO_STRIP"
  | "TEXT_BLOCK";

export type HomeSectionDTO = {
  id: string;
  type: HomeSectionTypeDTO;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  data: Record<string, unknown> | null;
  sortOrder: number;
};

export type StoreSettingDTO = {
  key: string;
  value: string;
};

export type ProductListParams = {
  category?: string;
  collection?: string;
  audience?: string;
  q?: string;
  limit?: number;
  page?: number;
};

export type ProductsPage = {
  products: PublicProductCard[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CatalogHomeData = {
  categories: PublicCategory[];
  audiences: PublicAudience[];
  collections: PublicCollection[];
  newProducts: PublicProductCard[];
  discountedProducts: PublicProductCard[];
  featuredProducts: PublicProductCard[];
};

export type HomePageData = CatalogHomeData & {
  sections: HomeSectionDTO[];
  settings: Record<string, string>;
};

export type CategoryPageData = {
  category: PublicCategory;
  products: PublicProductCard[];
};

export type CollectionPageData = {
  collection: PublicCollection;
  products: PublicProductCard[];
};

export type AudiencePageData = {
  audience: PublicAudience;
  products: PublicProductCard[];
};
