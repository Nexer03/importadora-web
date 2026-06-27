"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminStoreSetting,
  upsertAdminStoreSetting,
} from "@/services/admin/settings-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
} from "./action-utils";

export async function upsertStoreSettingAction(formData: FormData) {
  let target = "/admin/settings";

  try {
    await upsertAdminStoreSetting(formDataToRecord(formData));
    revalidatePath("/");
    revalidatePath("/admin/settings");
    target = "/admin/settings?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function createStoreSettingAction(formData: FormData) {
  let target = "/admin/settings";

  try {
    await createAdminStoreSetting(formDataToRecord(formData));
    revalidatePath("/");
    revalidatePath("/admin/settings");
    target = "/admin/settings?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
