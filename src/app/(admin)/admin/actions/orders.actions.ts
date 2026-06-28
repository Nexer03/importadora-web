"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  updateAdminOrderNotes,
  updateAdminOrderShipping,
  updateAdminOrderStatus,
} from "@/services/admin/order-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
} from "./action-utils";

function revalidateOrder(id: string) {
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/pedidos/${id}`;

  try {
    await updateAdminOrderStatus(id, formDataToRecord(formData));
    revalidateOrder(id);
    target = `/admin/pedidos/${id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function updateOrderShippingAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/pedidos/${id}`;

  try {
    await updateAdminOrderShipping(id, formDataToRecord(formData));
    revalidateOrder(id);
    target = `/admin/pedidos/${id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function updateOrderNotesAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/pedidos/${id}`;

  try {
    await updateAdminOrderNotes(id, formDataToRecord(formData));
    revalidateOrder(id);
    target = `/admin/pedidos/${id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
