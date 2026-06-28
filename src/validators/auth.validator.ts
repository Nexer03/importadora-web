import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(1, "Password requerido"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(120),
  email: z.string().trim().email("Correo invalido").max(160),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres")
    .max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
