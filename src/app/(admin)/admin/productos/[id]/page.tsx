import { notFound } from "next/navigation";

import {
  attachProductCollectionAction,
  detachProductCollectionAction,
} from "@/app/(admin)/admin/actions/collections.actions";
import {
  archiveProductAction,
  createProductImageAction,
  createProductVariantAction,
  deleteProductImageAction,
  deleteProductVariantAction,
  setPrimaryProductImageAction,
  updateProductAction,
  updateProductImageAction,
  updateProductVariantAction,
  uploadProductImageAction,
} from "@/app/(admin)/admin/actions/products.actions";
import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminCard } from "@/components/admin/AdminCard";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import {
  AdminCheckbox,
  AdminField,
  AdminFormGrid,
  AdminInput,
  AdminSelect,
  AdminSubmitButton,
} from "@/components/admin/AdminForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import {
  getAdminProductDetail,
  getAdminProductFormOptions,
} from "@/services/admin/product-admin.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductEditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function ProductEditPage({
  params,
  searchParams,
}: ProductEditPageProps) {
  const { id } = await params;
  const [query, product, options] = await Promise.all([
    searchParams,
    getAdminProductDetail(id),
    getAdminProductFormOptions(),
  ]);

  if (!product) {
    notFound();
  }

  const attachedCollectionIds = new Set(
    product.collections.map((collection) => collection.id)
  );
  const availableCollections = options.collections.filter(
    (collection) => !attachedCollectionIds.has(collection.id)
  );

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description={`Editando ${product.slug}`}
        actionHref="/admin/productos"
        actionLabel="Volver"
      />
      <AdminNotice error={query.error} saved={query.saved} />

      <div className="grid gap-6">
        <AdminCard title="Datos generales">
          <AdminProductForm
            action={updateProductAction}
            product={product}
            categories={options.categories}
            audiences={options.audiences}
            submitLabel="Guardar cambios"
          />
          <form action={archiveProductAction} className="mt-4">
            <input type="hidden" name="id" value={product.id} />
            <ConfirmSubmitButton
              className="inline-flex h-10 items-center rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950"
              message="Archivar este producto? Dejara de mostrarse en la tienda."
            >
              Archivar producto
            </ConfirmSubmitButton>
          </form>
        </AdminCard>

        <AdminCard title="Variantes">
          <div className="grid gap-4">
            {product.variants.length === 0 ? (
              <p className="text-sm text-zinc-600">Sin variantes.</p>
            ) : (
              product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="rounded-lg border border-zinc-200 p-4"
                >
                  <form action={updateProductVariantAction} className="space-y-4">
                    <input type="hidden" name="id" value={variant.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <AdminFormGrid>
                      <AdminField label="SKU">
                        <AdminInput name="sku" defaultValue={variant.sku} required />
                      </AdminField>
                      <AdminField label="Nombre">
                        <AdminInput
                          name="name"
                          defaultValue={variant.name}
                          required
                        />
                      </AdminField>
                      <AdminField label="Color">
                        <AdminInput name="color" defaultValue={variant.color ?? ""} />
                      </AdminField>
                      <AdminField label="Talla">
                        <AdminInput name="size" defaultValue={variant.size ?? ""} />
                      </AdminField>
                      <AdminField label="Precio override">
                        <AdminInput
                          type="number"
                          step="0.01"
                          min="0.01"
                          name="priceOverride"
                          defaultValue={variant.priceOverride ?? ""}
                        />
                      </AdminField>
                      <AdminField label="Stock total">
                        <AdminInput
                          type="number"
                          min="0"
                          name="stockTotal"
                          defaultValue={variant.stockTotal}
                        />
                      </AdminField>
                      <AdminField label="Stock disponible">
                        <AdminInput
                          type="number"
                          min="0"
                          name="stockAvailable"
                          defaultValue={variant.stockAvailable}
                        />
                      </AdminField>
                      <AdminField label="Stock reservado">
                        <AdminInput
                          type="number"
                          min="0"
                          name="stockReserved"
                          defaultValue={variant.stockReserved}
                        />
                      </AdminField>
                      <AdminCheckbox
                        name="isActive"
                        label="Activa"
                        defaultChecked={variant.isActive}
                      />
                    </AdminFormGrid>
                    <AdminSubmitButton>Guardar variante</AdminSubmitButton>
                  </form>
                  <form action={deleteProductVariantAction} className="mt-3">
                    <input type="hidden" name="id" value={variant.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950"
                    >
                      Eliminar variante
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>

          <form action={createProductVariantAction} className="mt-6 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <h3 className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Agregar variante
            </h3>
            <AdminFormGrid>
              <AdminField label="SKU">
                <AdminInput name="sku" required />
              </AdminField>
              <AdminField label="Nombre">
                <AdminInput name="name" required />
              </AdminField>
              <AdminField label="Color">
                <AdminInput name="color" />
              </AdminField>
              <AdminField label="Talla">
                <AdminInput name="size" />
              </AdminField>
              <AdminField label="Precio override">
                <AdminInput type="number" step="0.01" min="0.01" name="priceOverride" />
              </AdminField>
              <AdminField label="Stock total">
                <AdminInput type="number" min="0" name="stockTotal" defaultValue={0} />
              </AdminField>
              <AdminField label="Stock disponible">
                <AdminInput
                  type="number"
                  min="0"
                  name="stockAvailable"
                  defaultValue={0}
                />
              </AdminField>
              <AdminField label="Stock reservado">
                <AdminInput
                  type="number"
                  min="0"
                  name="stockReserved"
                  defaultValue={0}
                />
              </AdminField>
              <AdminCheckbox name="isActive" label="Activa" defaultChecked />
            </AdminFormGrid>
            <AdminSubmitButton>Agregar variante</AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard title="Imagenes">
          <form
            action={uploadProductImageAction}
            className="mb-6 space-y-3 rounded-lg border border-dashed border-zinc-300 p-4"
          >
            <input type="hidden" name="productId" value={product.id} />
            <h3 className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Subir imagen
            </h3>
            <p className="text-xs text-zinc-500">
              Se convierte automaticamente a WebP optimizado.
            </p>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
            <AdminFormGrid>
              <AdminField label="Alt">
                <AdminInput name="altText" />
              </AdminField>
              <AdminCheckbox name="isPrimary" label="Primaria" />
            </AdminFormGrid>
            <AdminSubmitButton>Subir y convertir a WebP</AdminSubmitButton>
          </form>

          <div className="grid gap-4 lg:grid-cols-2">
            {product.images.map((image) => (
              <div key={image.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="mb-4 aspect-video overflow-hidden rounded-md bg-zinc-100">
                  <img
                    src={image.url}
                    alt={image.altText ?? product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <form action={updateProductImageAction} className="space-y-4">
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <AdminField label="URL">
                    <AdminInput name="url" defaultValue={image.url} required />
                  </AdminField>
                  <AdminField label="Alt">
                    <AdminInput name="altText" defaultValue={image.altText ?? ""} />
                  </AdminField>
                  <AdminField label="Orden">
                    <AdminInput
                      type="number"
                      name="sortOrder"
                      defaultValue={image.sortOrder}
                    />
                  </AdminField>
                  <AdminCheckbox
                    name="isPrimary"
                    label="Primaria"
                    defaultChecked={image.isPrimary}
                  />
                  <AdminSubmitButton>Guardar imagen</AdminSubmitButton>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={setPrimaryProductImageAction}>
                    <input type="hidden" name="imageId" value={image.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950"
                    >
                      Marcar primaria
                    </button>
                  </form>
                  <form action={deleteProductImageAction}>
                    <input type="hidden" name="id" value={image.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-bold text-zinc-950"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <form action={createProductImageAction} className="mt-6 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <h3 className="text-sm font-black uppercase tracking-wide text-zinc-950">
              Agregar por URL
            </h3>
            <AdminFormGrid>
              <AdminField label="URL" full>
                <AdminInput name="url" required />
              </AdminField>
              <AdminField label="Alt">
                <AdminInput name="altText" />
              </AdminField>
              <AdminField label="Orden">
                <AdminInput type="number" name="sortOrder" defaultValue={0} />
              </AdminField>
              <AdminCheckbox name="isPrimary" label="Primaria" />
            </AdminFormGrid>
            <AdminSubmitButton>Agregar imagen</AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard title="Colecciones asociadas">
          <div className="flex flex-wrap gap-2">
            {product.collections.length === 0 ? (
              <p className="text-sm text-zinc-600">Sin colecciones asociadas.</p>
            ) : (
              product.collections.map((collection) => (
                <form key={collection.id} action={detachProductCollectionAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="collectionId" value={collection.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-950"
                  >
                    {collection.name} x
                  </button>
                </form>
              ))
            )}
          </div>
          <form action={attachProductCollectionAction} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="productId" value={product.id} />
            <AdminSelect name="collectionId" required>
              <option value="">Selecciona coleccion</option>
              {availableCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                  {collection.isActive ? "" : " (inactiva)"}
                </option>
              ))}
            </AdminSelect>
            <AdminSubmitButton>Asociar</AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard title="Resumen">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <p>
              <span className="font-bold">Precio:</span>{" "}
              {formatMXN(product.basePrice)}
            </p>
            <p>
              <span className="font-bold">Stock:</span> {product.stockAvailable}
            </p>
            <p>
              <span className="font-bold">Status:</span>{" "}
              <AdminBadge>{product.status}</AdminBadge>
            </p>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
