"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminPromotion,
  deactivateAdminPromotion,
  updateAdminPromotion,
} from "@/services/admin/promotion-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
  revalidateCatalogPaths,
} from "./action-utils";

export async function createPromotionAction(formData: FormData) {
  let target = "/admin/descuentos/nuevo";

  try {
    const promo = await createAdminPromotion(formDataToRecord(formData));
    revalidatePath("/admin/descuentos");
    revalidateCatalogPaths();
    target = `/admin/descuentos/${promo.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/descuentos/nuevo", error);
  }

  redirect(target);
}

export async function updatePromotionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/descuentos/${id}`;

  try {
    await updateAdminPromotion(id, formDataToRecord(formData));
    revalidatePath("/admin/descuentos");
    revalidatePath(`/admin/descuentos/${id}`);
    revalidateCatalogPaths();
    target = `/admin/descuentos/${id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deactivatePromotionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/descuentos";

  try {
    await deactivateAdminPromotion(id);
    revalidatePath("/admin/descuentos");
    revalidateCatalogPaths();
    target = "/admin/descuentos?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
