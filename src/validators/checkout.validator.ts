import { z } from "zod";

export const deliveryMethods = [
  "NATIONAL_SHIPPING",
  "LOCAL_DELIVERY",
  "LOCAL_PICKUP",
] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Nombre requerido").max(120),
    customerEmail: z.string().trim().email("Correo invalido").max(160),
    customerPhone: z
      .string()
      .trim()
      .min(7, "Telefono requerido")
      .max(20, "Telefono invalido"),
    deliveryMethod: z.enum(deliveryMethods, {
      message: "Metodo de entrega invalido",
    }),
    paymentProvider: z.string().trim().min(1, "Metodo de pago requerido"),
    shippingAddress: optionalText(300),
    postalCode: optionalText(10),
    city: optionalText(100),
    state: optionalText(100),
    addressReference: optionalText(300),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod !== "LOCAL_PICKUP") {
      const requiredAddress: Array<[keyof typeof data, string]> = [
        ["shippingAddress", "Direccion requerida"],
        ["postalCode", "Codigo postal requerido"],
        ["city", "Ciudad requerida"],
        ["state", "Estado requerido"],
      ];
      for (const [field, message] of requiredAddress) {
        if (!data[field]) {
          ctx.addIssue({ code: "custom", path: [field], message });
        }
      }
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
