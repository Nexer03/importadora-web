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
    requiresInvoice: z.boolean().default(false),
    fiscalRfc: optionalText(13),
    fiscalName: optionalText(200),
    fiscalPostalCode: optionalText(10),
    fiscalRegime: optionalText(100),
    fiscalCfdiUse: optionalText(100),
    fiscalEmail: z.string().trim().email("Correo fiscal invalido").max(160).optional().or(z.literal("")),
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

    if (data.requiresInvoice) {
      const requiredFiscal: Array<[keyof typeof data, string]> = [
        ["fiscalRfc", "RFC requerido"],
        ["fiscalName", "Nombre o razon social requerido"],
        ["fiscalPostalCode", "Codigo postal fiscal requerido"],
        ["fiscalRegime", "Regimen fiscal requerido"],
        ["fiscalCfdiUse", "Uso de CFDI requerido"],
      ];
      for (const [field, message] of requiredFiscal) {
        if (!data[field]) {
          ctx.addIssue({ code: "custom", path: [field], message });
        }
      }
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
