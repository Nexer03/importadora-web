import { z } from "zod";

export const discountTypes = [
  "PERCENTAGE",
  "FIXED_AMOUNT",
  "FREE_SHIPPING",
] as const;

const emptyToUndef = (v: unknown) => (v === "" || v === null ? undefined : v);

export const couponInputSchema = z.object({
  code: z.string().trim().min(2, "Codigo requerido").max(40),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  discountType: z.enum(discountTypes, { message: "Tipo de descuento invalido" }),
  discountValue: z.preprocess(
    emptyToUndef,
    z.coerce.number().min(0, "Valor invalido")
  ),
  minPurchaseAmount: z.preprocess(
    emptyToUndef,
    z.coerce.number().min(0).optional()
  ),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
  maxUses: z.preprocess(emptyToUndef, z.coerce.number().int().min(1).optional()),
  isActive: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean()
  ),
});

export type CouponInput = z.infer<typeof couponInputSchema>;
