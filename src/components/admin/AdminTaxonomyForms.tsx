import type { AdminAudienceDTO } from "@/services/admin/audience-admin.service";
import type { AdminCategoryDTO } from "@/services/admin/category-admin.service";
import type { AdminCollectionDTO } from "@/services/admin/collection-admin.service";

import {
  AdminCheckbox,
  AdminField,
  AdminFormGrid,
  AdminInput,
  AdminSubmitButton,
  AdminTextarea,
} from "./AdminForm";

type FormAction = (formData: FormData) => void | Promise<void>;

export function AdminCategoryForm({
  action,
  category,
  submitLabel,
}: {
  action: FormAction;
  category?: AdminCategoryDTO;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <AdminFormGrid>
        <AdminField label="Nombre">
          <AdminInput name="name" defaultValue={category?.name} required />
        </AdminField>
        <AdminField label="Slug">
          <AdminInput name="slug" defaultValue={category?.slug} required />
        </AdminField>
        <AdminField label="Imagen URL" full>
          <AdminInput name="imageUrl" defaultValue={category?.imageUrl ?? ""} />
        </AdminField>
        <AdminField label="Descripcion" full>
          <AdminTextarea
            name="description"
            defaultValue={category?.description ?? ""}
          />
        </AdminField>
        <AdminField label="Orden">
          <AdminInput
            type="number"
            name="sortOrder"
            defaultValue={category?.sortOrder ?? 0}
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminCheckbox
            name="isActive"
            label="Activa"
            defaultChecked={category?.isActive ?? true}
          />
          <AdminCheckbox
            name="indexable"
            label="Indexable"
            defaultChecked={category?.indexable ?? true}
          />
        </div>
        <AdminField label="SEO title">
          <AdminInput name="seoTitle" defaultValue={category?.seoTitle ?? ""} />
        </AdminField>
        <AdminField label="OG image">
          <AdminInput name="ogImage" defaultValue={category?.ogImage ?? ""} />
        </AdminField>
        <AdminField label="SEO description" full>
          <AdminTextarea
            name="seoDescription"
            defaultValue={category?.seoDescription ?? ""}
          />
        </AdminField>
        <AdminField label="SEO keywords" full>
          <AdminInput
            name="seoKeywords"
            defaultValue={category?.seoKeywords ?? ""}
          />
        </AdminField>
      </AdminFormGrid>
      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}

export function AdminAudienceForm({
  action,
  audience,
  submitLabel,
}: {
  action: FormAction;
  audience?: AdminAudienceDTO;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {audience ? <input type="hidden" name="id" value={audience.id} /> : null}
      <AdminFormGrid>
        <AdminField label="Nombre">
          <AdminInput name="name" defaultValue={audience?.name} required />
        </AdminField>
        <AdminField label="Slug">
          <AdminInput name="slug" defaultValue={audience?.slug} required />
        </AdminField>
        <AdminField label="Descripcion" full>
          <AdminTextarea
            name="description"
            defaultValue={audience?.description ?? ""}
          />
        </AdminField>
        <AdminField label="Orden">
          <AdminInput
            type="number"
            name="sortOrder"
            defaultValue={audience?.sortOrder ?? 0}
          />
        </AdminField>
        <AdminCheckbox
          name="isActive"
          label="Activo"
          defaultChecked={audience?.isActive ?? true}
        />
      </AdminFormGrid>
      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}

export function AdminCollectionForm({
  action,
  collection,
  submitLabel,
}: {
  action: FormAction;
  collection?: AdminCollectionDTO;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {collection ? (
        <input type="hidden" name="id" value={collection.id} />
      ) : null}
      <AdminFormGrid>
        <AdminField label="Nombre">
          <AdminInput name="name" defaultValue={collection?.name} required />
        </AdminField>
        <AdminField label="Slug">
          <AdminInput name="slug" defaultValue={collection?.slug} required />
        </AdminField>
        <AdminField label="Imagen URL" full>
          <AdminInput
            name="imageUrl"
            defaultValue={collection?.imageUrl ?? ""}
          />
        </AdminField>
        <AdminField label="Descripcion" full>
          <AdminTextarea
            name="description"
            defaultValue={collection?.description ?? ""}
          />
        </AdminField>
        <AdminField label="Orden">
          <AdminInput
            type="number"
            name="sortOrder"
            defaultValue={collection?.sortOrder ?? 0}
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminCheckbox
            name="isActive"
            label="Activa"
            defaultChecked={collection?.isActive ?? true}
          />
          <AdminCheckbox
            name="indexable"
            label="Indexable"
            defaultChecked={collection?.indexable ?? true}
          />
        </div>
        <AdminField label="SEO title">
          <AdminInput
            name="seoTitle"
            defaultValue={collection?.seoTitle ?? ""}
          />
        </AdminField>
        <AdminField label="OG image">
          <AdminInput name="ogImage" defaultValue={collection?.ogImage ?? ""} />
        </AdminField>
        <AdminField label="SEO description" full>
          <AdminTextarea
            name="seoDescription"
            defaultValue={collection?.seoDescription ?? ""}
          />
        </AdminField>
        <AdminField label="SEO keywords" full>
          <AdminInput
            name="seoKeywords"
            defaultValue={collection?.seoKeywords ?? ""}
          />
        </AdminField>
      </AdminFormGrid>
      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}
