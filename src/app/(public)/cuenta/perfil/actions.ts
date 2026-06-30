"use server";

import { revalidatePath } from "next/cache";

import {
  AccountError,
  changeCustomerPassword,
  updateCustomerProfile,
} from "@/services/account.service";

export type AccountActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

export async function updateProfileAction(
  _prevState: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  try {
    await updateCustomerProfile({ name: formData.get("name") });
    revalidatePath("/", "layout");
    return { ok: true, message: "Perfil actualizado." };
  } catch (error) {
    if (error instanceof AccountError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo actualizar el perfil." };
  }
}

export async function changePasswordAction(
  _prevState: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  try {
    await changeCustomerPassword({
      currentPassword: formData.get("currentPassword") ?? "",
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });
    return { ok: true, message: "Contrasena actualizada." };
  } catch (error) {
    if (error instanceof AccountError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo cambiar la contrasena." };
  }
}
