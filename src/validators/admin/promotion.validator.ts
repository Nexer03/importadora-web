import { z } from "zod";

export const promotionScopes = ["ALL", "CATEGORY", "COLLECTION"] as const;
export const promotionDiscountTypes = ["PERCENTAGE", "FIXED_AMOUNT"] as const;

const emptyToUndef = (v: unknown) => (v === "" || v === null ? undefined : v);

export const promotionInputSchema = z
  .object({
    name: z.string().trim().min(2, "Nombre requerido").max(120),
    discountType: z.enum(promotionDiscountTypes, {
      message: "Tipo de descuento invalido",
    }),
    discountValue: z.preprocess(
      emptyToUndef,
      z.coerce.number().min(0, "Valor invalido")
    ),
    scope: z.enum(promotionScopes, { message: "Alcance invalido" }),
    categoryId: z.string().trim().optional().or(z.literal("")),
    collectionId: z.string().trim().optional().or(z.literal("")),
    startsAt: z.string().optional().or(z.literal("")),
    endsAt: z.string().optional().or(z.literal("")),
    isActive: z.preprocess(
      (v) => v === "on" || v === "true" || v === true,
      z.boolean()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.scope === "CATEGORY" && !data.categoryId) {
      ctx.addIssue({
        code: "custom",
        path: ["categoryId"],
        message: "Selecciona una categoria",
      });
    }
    if (data.scope === "COLLECTION" && !data.collectionId) {
      ctx.addIssue({
        code: "custom",
        path: ["collectionId"],
        message: "Selecciona una coleccion",
      });
    }
  });

export type PromotionInput = z.infer<typeof promotionInputSchema>;
