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

const statusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  HIDDEN: "Oculto",
  OUT_OF_STOCK: "Agotado",
  ARCHIVED: "Archivado",
};

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
        <AdminField
          label="Slug (opcional)"
          hint="Es la parte de la URL del producto. Si lo dejas vacio se genera del nombre."
        >
          <AdminInput
            name="slug"
            defaultValue={product?.slug}
            placeholder="Se genera del nombre"
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
        <AdminField
          label="Precio con descuento (opcional)"
          hint="Si el producto esta en oferta, pon aqui el precio rebajado. Debe ser menor al precio base."
        >
          <AdminInput
            type="number"
            step="0.01"
            min="0.01"
            name="discountPrice"
            defaultValue={product?.discountPrice ?? ""}
          />
        </AdminField>
        <AdminField
          label="Status"
          hint="PUBLISHED = visible en la tienda. DRAFT = borrador (no se muestra)."
        >
          <AdminSelect name="status" defaultValue={product?.status ?? "DRAFT"} required>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status] ?? status}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
          <AdminCheckbox
            name="isFeatured"
            label="Destacado"
            hint="Aparece en la seccion de destacados del inicio."
            defaultChecked={product?.isFeatured}
          />
          <AdminCheckbox
            name="isNew"
            label="Nuevo"
            hint="Marca el producto con la etiqueta 'Nuevo' y lo muestra en Novedades."
            defaultChecked={product?.isNew}
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
            Inventario
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Se crea una variante interna automaticamente. Despues puedes agregar
            colores o tallas desde la edicion del producto.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField
              label="Stock inicial"
              hint="Cuantas piezas tienes disponibles. Puedes ajustarlo despues."
            >
              <AdminInput
                type="number"
                name="defaultStock"
                min="0"
                defaultValue={0}
              />
            </AdminField>
          </div>
        </div>
      ) : null}

      <details className="rounded-lg border border-zinc-200 p-4">
        <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-zinc-950">
          SEO y avanzado (opcional)
        </summary>
        <p className="mt-2 text-xs text-zinc-500">
          Solo si quieres personalizar como se ve en Google y redes. Si lo dejas
          vacio se genera automaticamente del nombre y la descripcion.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AdminCheckbox
              name="indexable"
              label="Mostrar en buscadores (Google)"
              hint="Si lo desactivas, el producto no aparece en Google ni en el sitemap."
              defaultChecked={product?.indexable ?? true}
            />
          </div>
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
      </details>

      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}
