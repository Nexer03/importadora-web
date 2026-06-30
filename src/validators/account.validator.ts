import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(120),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .min(8, "La contrasena debe tener al menos 8 caracteres")
      .max(100),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Las contrasenas no coinciden",
      });
    }
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
