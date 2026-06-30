import { z } from "zod";

import {
  booleanSchema,
  integerSchema,
  nonNegativeNumberSchema,
  optionalPositiveNumberSchema,
  optionalTextSchema,
  optionalUrlSchema,
  positiveNumberSchema,
  requiredStringSchema,
} from "./common";

export const productStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "HIDDEN",
  "OUT_OF_STOCK",
  "ARCHIVED",
]);

export const productInputSchema = z
  .object({
    name: requiredStringSchema,
    slug: optionalTextSchema,
    shortDescription: optionalTextSchema,
    description: optionalTextSchema,
    basePrice: positiveNumberSchema,
    discountPrice: optionalPositiveNumberSchema,
    status: productStatusSchema,
    categoryId: requiredStringSchema,
    audienceId: requiredStringSchema,
    isFeatured: booleanSchema,
    isNew: booleanSchema,
    seoTitle: optionalTextSchema,
    seoDescription: optionalTextSchema,
    seoKeywords: optionalTextSchema,
    canonicalUrl: optionalUrlSchema,
    ogTitle: optionalTextSchema,
    ogDescription: optionalTextSchema,
    ogImage: optionalUrlSchema,
    indexable: booleanSchema,
  })
  .superRefine((data, ctx) => {
    if (data.discountPrice && data.discountPrice >= data.basePrice) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "El descuento debe ser menor al precio base",
      });
    }
  });

export const productVariantInputSchema = z.object({
  sku: requiredStringSchema,
  name: requiredStringSchema,
  color: optionalTextSchema,
  size: optionalTextSchema,
  priceOverride: optionalPositiveNumberSchema,
  stockTotal: nonNegativeNumberSchema,
  stockAvailable: nonNegativeNumberSchema,
  stockReserved: nonNegativeNumberSchema,
  isActive: booleanSchema,
});

export const defaultProductVariantInputSchema = productVariantInputSchema.pick({
  sku: true,
  name: true,
  stockTotal: true,
  stockAvailable: true,
});

/**
 * Variante por defecto simplificada para crear un producto: solo el stock
 * inicial. El SKU y el nombre ("Default") se generan automaticamente.
 */
export const defaultVariantInputSchema = z.object({
  stock: z.preprocess(
    (value) =>
      value === "" || value === undefined || value === null ? 0 : value,
    z.coerce.number().int().min(0, "El stock debe ser mayor o igual a 0")
  ),
});

export const productImageInputSchema = z.object({
  url: requiredStringSchema.pipe(z.string().url("URL invalida")),
  altText: optionalTextSchema,
  sortOrder: integerSchema,
  isPrimary: booleanSchema,
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductVariantInput = z.infer<typeof productVariantInputSchema>;
export type DefaultProductVariantInput = z.infer<
  typeof defaultProductVariantInputSchema
>;
export type ProductImageInput = z.infer<typeof productImageInputSchema>;
