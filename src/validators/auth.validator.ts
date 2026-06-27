import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(1, "Password requerido"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
