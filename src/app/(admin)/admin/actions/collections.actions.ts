"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  attachAdminProductToCollection,
  createAdminCollection,
  deleteOrDeactivateAdminCollection,
  detachAdminProductFromCollection,
  updateAdminCollection,
} from "@/services/admin/collection-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
  revalidateCatalogPaths,
} from "./action-utils";

export async function createCollectionAction(formData: FormData) {
  let target = "/admin/colecciones/nueva";

  try {
    const collection = await createAdminCollection(formDataToRecord(formData));
    revalidateCatalogPaths();
    target = `/admin/colecciones/${collection.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/colecciones/nueva", error);
  }

  redirect(target);
}

export async function updateCollectionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/colecciones/${id}`;

  try {
    const collection = await updateAdminCollection(
      id,
      formDataToRecord(formData)
    );
    revalidateCatalogPaths();
    revalidatePath(`/coleccion/${collection.slug}`);
    target = `/admin/colecciones/${collection.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteOrDeactivateCollectionAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = "/admin/colecciones";

  try {
    await deleteOrDeactivateAdminCollection(id);
    revalidateCatalogPaths();
    target = "/admin/colecciones?saved=1";
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function attachProductCollectionAction(formData: FormData) {
  const productId = getRequiredFormValue(formData, "productId");
  const collectionId = getRequiredFormValue(formData, "collectionId");
  let target = `/admin/productos/${productId}`;

  try {
    await attachAdminProductToCollection(productId, collectionId);
    revalidateCatalogPaths();
    revalidatePath(target);
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function detachProductCollectionAction(formData: FormData) {
  const productId = getRequiredFormValue(formData, "productId");
  const collectionId = getRequiredFormValue(formData, "collectionId");
  let target = `/admin/productos/${productId}`;

  try {
    await detachAdminProductFromCollection(productId, collectionId);
    revalidateCatalogPaths();
    revalidatePath(target);
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
