"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminHomeSection,
  deleteAdminHomeSection,
  updateAdminHomeSection,
} from "@/services/admin/home-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
} from "./action-utils";

export async function createHomeSectionAction(formData: FormData) {
  let target = "/admin/home/nuevo";

  try {
    const section = await createAdminHomeSection(formDataToRecord(formData));
    revalidatePath("/");
    revalidatePath("/admin/home");
    target = `/admin/home/${section.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/home/nuevo", error);
  }

  redirect(target);
}

export async function updateHomeSectionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/home/${id}`;

  try {
    const section = await updateAdminHomeSection(
      id,
      formDataToRecord(formData)
    );
    revalidatePath("/");
    revalidatePath("/admin/home");
    target = `/admin/home/${section.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteHomeSectionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/home";

  try {
    await deleteAdminHomeSection(id);
    revalidatePath("/");
    revalidatePath("/admin/home");
    target = "/admin/home?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
