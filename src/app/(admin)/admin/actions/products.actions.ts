"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveProductImageWebp } from "@/lib/uploads";
import {
  addUploadedProductImage,
  archiveAdminProduct,
  createAdminProduct,
  createAdminProductImage,
  createAdminProductVariant,
  deleteAdminProductImage,
  deleteAdminProductVariant,
  setAdminPrimaryProductImage,
  updateAdminProduct,
  updateAdminProductImage,
  updateAdminProductVariant,
} from "@/services/admin/product-admin.service";

import {
  errorRedirectPath,
  formDataToRecord,
  getRequiredFormValue,
  revalidateProductPaths,
} from "./action-utils";

function productDataFromForm(formData: FormData) {
  const data = formDataToRecord(formData);

  return {
    name: data.name,
    slug: data.slug,
    shortDescription: data.shortDescription,
    description: data.description,
    basePrice: data.basePrice,
    discountPrice: data.discountPrice,
    status: data.status,
    categoryId: data.categoryId,
    audienceId: data.audienceId,
    isFeatured: data.isFeatured,
    isNew: data.isNew,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    seoKeywords: data.seoKeywords,
    canonicalUrl: data.canonicalUrl,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    ogImage: data.ogImage,
    indexable: data.indexable,
  };
}

function variantDataFromForm(formData: FormData) {
  const data = formDataToRecord(formData);

  return {
    sku: data.sku,
    name: data.name,
    color: data.color,
    size: data.size,
    priceOverride: data.priceOverride,
    stockTotal: data.stockTotal,
    stockAvailable: data.stockAvailable,
    stockReserved: data.stockReserved,
    isActive: data.isActive,
  };
}

function imageDataFromForm(formData: FormData) {
  const data = formDataToRecord(formData);

  return {
    url: data.url,
    altText: data.altText,
    sortOrder: data.sortOrder,
    isPrimary: data.isPrimary,
  };
}

export async function createProductAction(formData: FormData) {
  let target = "/admin/productos/nuevo";

  try {
    const product = await createAdminProduct(productDataFromForm(formData), {
      sku: formData.get("defaultSku"),
      name: formData.get("defaultVariantName"),
      stockTotal: formData.get("defaultStockTotal"),
      stockAvailable: formData.get("defaultStockAvailable"),
    });

    revalidateProductPaths(product);
    target = `/admin/productos/${product.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath("/admin/productos/nuevo", error);
  }

  redirect(target);
}

export async function updateProductAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/productos/${id}`;

  try {
    const product = await updateAdminProduct(id, productDataFromForm(formData));
    revalidateProductPaths(product);
    target = `/admin/productos/${product.id}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(`/admin/productos/${id}`, error);
  }

  redirect(target);
}

export async function archiveProductAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  let target = `/admin/productos/${id}`;

  try {
    const product = await archiveAdminProduct(id);
    revalidateProductPaths(product);
    target = "/admin/productos?saved=1";
  } catch (error) {
    target = errorRedirectPath(`/admin/productos/${id}`, error);
  }

  redirect(target);
}

export async function createProductVariantAction(formData: FormData) {
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await createAdminProductVariant(productId, variantDataFromForm(formData));
    revalidatePath(target);
    revalidatePath("/productos");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function updateProductVariantAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await updateAdminProductVariant(id, variantDataFromForm(formData));
    revalidatePath(target);
    revalidatePath("/productos");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteProductVariantAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await deleteAdminProductVariant(id);
    revalidatePath(target);
    revalidatePath("/productos");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function uploadProductImageAction(formData: FormData) {
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      throw new Error("Selecciona una imagen.");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen.");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("La imagen no debe superar 8 MB.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveProductImageWebp(buffer);
    const altTextRaw = formData.get("altText");
    const altText =
      typeof altTextRaw === "string" && altTextRaw.trim()
        ? altTextRaw.trim()
        : null;
    const isPrimary = formData.get("isPrimary") === "on";

    await addUploadedProductImage(productId, { url, altText, isPrimary });
    revalidatePath(target);
    revalidatePath("/productos");
    revalidatePath("/");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function createProductImageAction(formData: FormData) {
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await createAdminProductImage(productId, imageDataFromForm(formData));
    revalidatePath(target);
    revalidatePath("/productos");
    revalidatePath("/");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function updateProductImageAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await updateAdminProductImage(id, imageDataFromForm(formData));
    revalidatePath(target);
    revalidatePath("/productos");
    revalidatePath("/");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function deleteProductImageAction(formData: FormData) {
  const id = getRequiredFormValue(formData, "id");
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await deleteAdminProductImage(id);
    revalidatePath(target);
    revalidatePath("/productos");
    revalidatePath("/");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}

export async function setPrimaryProductImageAction(formData: FormData) {
  const imageId = getRequiredFormValue(formData, "imageId");
  const productId = getRequiredFormValue(formData, "productId");
  let target = `/admin/productos/${productId}`;

  try {
    await setAdminPrimaryProductImage(productId, imageId);
    revalidatePath(target);
    revalidatePath("/productos");
    revalidatePath("/");
    target = `${target}?saved=1`;
  } catch (error) {
    target = errorRedirectPath(target, error);
  }

  redirect(target);
}
