import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().max(60).optional().or(z.literal("")),
  fullName: z.string().trim().min(2, "Nombre requerido").max(120),
  phone: z.string().trim().min(7, "Telefono requerido").max(20),
  address: z.string().trim().min(3, "Direccion requerida").max(300),
  postalCode: z.string().trim().min(3, "Codigo postal requerido").max(10),
  city: z.string().trim().min(2, "Ciudad requerida").max(100),
  state: z.string().trim().min(2, "Estado requerido").max(100),
  reference: z.string().trim().max(300).optional().or(z.literal("")),
  isDefault: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean()
  ),
});

export type AddressInput = z.infer<typeof addressSchema>;
