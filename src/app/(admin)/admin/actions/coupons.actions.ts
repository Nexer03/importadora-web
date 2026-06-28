"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminCoupon,
  deactivateAdminCoupon,
  updateAdminCoupon,
} from "@/services/admin/coupon-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
} from "./action-utils";

export async function createCouponAction(formData: FormData) {
  let target = "/admin/promociones/nueva";

  try {
    const coupon = await createAdminCoupon(formDataToRecord(formData));
    revalidatePath("/admin/promociones");
    target = `/admin/promociones/${coupon.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/promociones/nueva", error);
  }

  redirect(target);
}

export async function updateCouponAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/promociones/${id}`;

  try {
    await updateAdminCoupon(id, formDataToRecord(formData));
    revalidatePath("/admin/promociones");
    revalidatePath(`/admin/promociones/${id}`);
    target = `/admin/promociones/${id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deactivateCouponAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/promociones";

  try {
    await deactivateAdminCoupon(id);
    revalidatePath("/admin/promociones");
    target = "/admin/promociones?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
