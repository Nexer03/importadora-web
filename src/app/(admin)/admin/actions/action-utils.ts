import { revalidatePath } from "next/cache";

import type { AdminProductDTO } from "@/services/admin/product-admin.service";
import { getActionErrorMessage } from "@/services/admin/admin-service-utils";

export function formDataToRecord(formData: FormData) {
  const record: Record<string, FormDataEntryValue> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("$ACTION_")) {
      record[key] = value;
    }
  }

  return record;
}

export function getRequiredFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing form value: ${key}`);
  }

  return value;
}

export function errorRedirectPath(path: string, error: unknown) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(
    getActionErrorMessage(error)
  )}`;
}

export function revalidateCatalogPaths() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/sitemap.xml");
}

export function revalidateProductPaths(product: AdminProductDTO) {
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${product.id}`);
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath(`/categoria/${product.categorySlug}`);
  revalidatePath("/productos");
  revalidatePath("/");

  for (const collection of product.collections) {
    revalidatePath(`/coleccion/${collection.slug}`);
  }
}
