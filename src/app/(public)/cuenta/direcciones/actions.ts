"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AddressError,
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/services/address.service";

function errorTarget(path: string, error: unknown): string {
  const message =
    error instanceof AddressError ? error.message : "No se pudo guardar.";
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}error=${encodeURIComponent(message)}`;
}

function formToRecord(formData: FormData) {
  const record: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("$ACTION_")) {
      record[key] = value;
    }
  }
  return record;
}

export async function createAddressAction(formData: FormData) {
  let target = "/cuenta/direcciones";
  try {
    await createCustomerAddress(formToRecord(formData));
    revalidatePath("/cuenta/direcciones");
  } catch (error) {
    target = errorTarget("/cuenta/direcciones/nueva", error);
  }
  redirect(target);
}

export async function updateAddressAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  let target = "/cuenta/direcciones";
  try {
    await updateCustomerAddress(id, formToRecord(formData));
    revalidatePath("/cuenta/direcciones");
  } catch (error) {
    target = errorTarget(`/cuenta/direcciones/${id}`, error);
  }
  redirect(target);
}

export async function deleteAddressAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  try {
    await deleteCustomerAddress(id);
  } catch {
    // sin efecto si no existe
  }
  revalidatePath("/cuenta/direcciones");
  redirect("/cuenta/direcciones");
}
