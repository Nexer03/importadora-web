import { z } from "zod";

import {
  booleanSchema,
  integerSchema,
  optionalTextSchema,
  optionalUrlSchema,
  requiredStringSchema,
} from "./common";

export const collectionInputSchema = z.object({
  name: requiredStringSchema,
  slug: requiredStringSchema,
  description: optionalTextSchema,
  imageUrl: optionalUrlSchema,
  isActive: booleanSchema,
  sortOrder: integerSchema,
  seoTitle: optionalTextSchema,
  seoDescription: optionalTextSchema,
  seoKeywords: optionalTextSchema,
  indexable: booleanSchema,
  ogImage: optionalUrlSchema,
});

export type CollectionInput = z.infer<typeof collectionInputSchema>;
