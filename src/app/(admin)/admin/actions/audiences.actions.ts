"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminAudience,
  deleteOrDeactivateAdminAudience,
  updateAdminAudience,
} from "@/services/admin/audience-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
  revalidateCatalogPaths,
} from "./action-utils";

export async function createAudienceAction(formData: FormData) {
  let target = "/admin/publicos/nuevo";

  try {
    const audience = await createAdminAudience(formDataToRecord(formData));
    revalidateCatalogPaths();
    target = `/admin/publicos/${audience.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/publicos/nuevo", error);
  }

  redirect(target);
}

export async function updateAudienceAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/publicos/${id}`;

  try {
    const audience = await updateAdminAudience(id, formDataToRecord(formData));
    revalidateCatalogPaths();
    revalidatePath(`/productos?audience=${audience.slug}`);
    target = `/admin/publicos/${audience.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteOrDeactivateAudienceAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/publicos";

  try {
    await deleteOrDeactivateAdminAudience(id);
    revalidateCatalogPaths();
    target = "/admin/publicos?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
