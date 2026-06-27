import type { AdminProductDTO } from "@/services/admin/product-admin.service";

import {
  AdminCheckbox,
  AdminField,
  AdminFormGrid,
  AdminInput,
  AdminSelect,
  AdminSubmitButton,
  AdminTextarea,
} from "./AdminForm";

type ProductOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type AdminProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: AdminProductDTO;
  categories: ProductOption[];
  audiences: ProductOption[];
  submitLabel: string;
  includeDefaultVariant?: boolean;
};

const statuses = ["DRAFT", "PUBLISHED", "HIDDEN", "OUT_OF_STOCK", "ARCHIVED"];

export function AdminProductForm({
  action,
  product,
  categories,
  audiences,
  submitLabel,
  includeDefaultVariant = false,
}: AdminProductFormProps) {
  return (
    <form action={action} className="space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <AdminFormGrid>
        <AdminField label="Nombre">
          <AdminInput
            name="name"
            defaultValue={product?.name}
            required
            placeholder="Bolso urbano"
          />
        </AdminField>
        <AdminField label="Slug">
          <AdminInput
            name="slug"
            defaultValue={product?.slug}
            required
            placeholder="bolso-urbano"
          />
        </AdminField>
        <AdminField label="Categoria">
          <AdminSelect name="categoryId" defaultValue={product?.categoryId} required>
            <option value="">Selecciona categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? "" : " (inactiva)"}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Publico">
          <AdminSelect name="audienceId" defaultValue={product?.audienceId} required>
            <option value="">Selecciona publico</option>
            {audiences.map((audience) => (
              <option key={audience.id} value={audience.id}>
                {audience.name}
                {audience.isActive ? "" : " (inactivo)"}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Precio base">
          <AdminInput
            type="number"
            step="0.01"
            min="0.01"
            name="basePrice"
            defaultValue={product?.basePrice}
            required
          />
        </AdminField>
        <AdminField label="Precio descuento">
          <AdminInput
            type="number"
            step="0.01"
            min="0.01"
            name="discountPrice"
            defaultValue={product?.discountPrice ?? ""}
          />
        </AdminField>
        <AdminField label="Status">
          <AdminSelect name="status" defaultValue={product?.status ?? "DRAFT"} required>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-3 sm:col-span-2">
          <AdminCheckbox
            name="isFeatured"
            label="Destacado"
            defaultChecked={product?.isFeatured}
          />
          <AdminCheckbox name="isNew" label="Nuevo" defaultChecked={product?.isNew} />
          <AdminCheckbox
            name="indexable"
            label="Indexable"
            defaultChecked={product?.indexable ?? true}
          />
        </div>
        <AdminField label="Descripcion corta" full>
          <AdminTextarea
            name="shortDescription"
            defaultValue={product?.shortDescription ?? ""}
          />
        </AdminField>
        <AdminField label="Descripcion" full>
          <AdminTextarea name="description" defaultValue={product?.description ?? ""} />
        </AdminField>
      </AdminFormGrid>

      {includeDefaultVariant ? (
        <div className="rounded-lg border border-zinc-200 p-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950">
            Variante default
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="SKU">
              <AdminInput name="defaultSku" required placeholder="SKU-001" />
            </AdminField>
            <AdminField label="Nombre variante">
              <AdminInput name="defaultVariantName" required defaultValue="Default" />
            </AdminField>
            <AdminField label="Stock total">
              <AdminInput
                type="number"
                name="defaultStockTotal"
                min="0"
                required
                defaultValue={0}
              />
            </AdminField>
            <AdminField label="Stock disponible">
              <AdminInput
                type="number"
                name="defaultStockAvailable"
                min="0"
                required
                defaultValue={0}
              />
            </AdminField>
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-zinc-200 p-4">
        <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950">
          SEO
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField label="SEO title">
            <AdminInput name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
          </AdminField>
          <AdminField label="Canonical URL">
            <AdminInput name="canonicalUrl" defaultValue={product?.canonicalUrl ?? ""} />
          </AdminField>
          <AdminField label="SEO description" full>
            <AdminTextarea
              name="seoDescription"
              defaultValue={product?.seoDescription ?? ""}
            />
          </AdminField>
          <AdminField label="SEO keywords" full>
            <AdminInput name="seoKeywords" defaultValue={product?.seoKeywords ?? ""} />
          </AdminField>
          <AdminField label="OG title">
            <AdminInput name="ogTitle" defaultValue={product?.ogTitle ?? ""} />
          </AdminField>
          <AdminField label="OG image">
            <AdminInput name="ogImage" defaultValue={product?.ogImage ?? ""} />
          </AdminField>
          <AdminField label="OG description" full>
            <AdminTextarea
              name="ogDescription"
              defaultValue={product?.ogDescription ?? ""}
            />
          </AdminField>
        </div>
      </div>

      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}
