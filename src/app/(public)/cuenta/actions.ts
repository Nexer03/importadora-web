"use server";

import { registerCustomer, RegisterError } from "@/services/auth.service";

export type RegisterState = {
  ok: boolean;
  error?: string;
  email?: string;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  try {
    const { email } = await registerCustomer({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    return { ok: true, email };
  } catch (error) {
    if (error instanceof RegisterError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo crear la cuenta. Intenta de nuevo." };
  }
}
