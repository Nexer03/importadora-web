"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminCategory,
  deleteOrDeactivateAdminCategory,
  updateAdminCategory,
} from "@/services/admin/category-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
  revalidateCatalogPaths,
} from "./action-utils";

export async function createCategoryAction(formData: FormData) {
  let target = "/admin/categorias/nueva";

  try {
    const category = await createAdminCategory(formDataToRecord(formData));
    revalidateCatalogPaths();
    target = `/admin/categorias/${category.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/categorias/nueva", error);
  }

  redirect(target);
}

export async function updateCategoryAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/categorias/${id}`;

  try {
    const category = await updateAdminCategory(id, formDataToRecord(formData));
    revalidateCatalogPaths();
    revalidatePath(`/categoria/${category.slug}`);
    target = `/admin/categorias/${category.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteOrDeactivateCategoryAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/categorias";

  try {
    await deleteOrDeactivateAdminCategory(id);
    revalidateCatalogPaths();
    target = "/admin/categorias?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
