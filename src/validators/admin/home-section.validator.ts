import { z } from "zod";

import {
  booleanSchema,
  integerSchema,
  optionalDateSchema,
  optionalTextSchema,
  optionalUrlSchema,
} from "./common";

export const homeSectionTypeSchema = z.enum([
  "HERO",
  "BANNER",
  "PRODUCT_CAROUSEL",
  "CATEGORY_GRID",
  "COLLECTION_GRID",
  "PROMO_STRIP",
  "TEXT_BLOCK",
]);

export const homeSectionInputSchema = z.object({
  type: homeSectionTypeSchema,
  title: optionalTextSchema,
  subtitle: optionalTextSchema,
  imageUrl: optionalUrlSchema,
  buttonText: optionalTextSchema,
  buttonUrl: optionalTextSchema,
  sortOrder: integerSchema,
  isActive: booleanSchema,
  startsAt: optionalDateSchema,
  endsAt: optionalDateSchema,
});

export type HomeSectionInput = z.infer<typeof homeSectionInputSchema>;
