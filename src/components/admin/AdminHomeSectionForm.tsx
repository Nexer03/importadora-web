import type { AdminHomeSectionDTO } from "@/services/admin/home-admin.service";

import {
  AdminCheckbox,
  AdminField,
  AdminFormGrid,
  AdminInput,
  AdminSelect,
  AdminSubmitButton,
  AdminTextarea,
} from "./AdminForm";

type AdminHomeSectionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  section?: AdminHomeSectionDTO;
  submitLabel: string;
};

const sectionTypes = [
  "HERO",
  "BANNER",
  "PRODUCT_CAROUSEL",
  "CATEGORY_GRID",
  "COLLECTION_GRID",
  "PROMO_STRIP",
  "TEXT_BLOCK",
];

function formatDateTimeLocal(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export function AdminHomeSectionForm({
  action,
  section,
  submitLabel,
}: AdminHomeSectionFormProps) {
  return (
    <form action={action} className="space-y-5">
      {section ? <input type="hidden" name="id" value={section.id} /> : null}
      <AdminFormGrid>
        <AdminField label="Tipo">
          <AdminSelect name="type" defaultValue={section?.type ?? "HERO"} required>
            {sectionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Orden">
          <AdminInput
            type="number"
            name="sortOrder"
            defaultValue={section?.sortOrder ?? 0}
          />
        </AdminField>
        <AdminField label="Titulo">
          <AdminInput name="title" defaultValue={section?.title ?? ""} />
        </AdminField>
        <AdminField label="Imagen URL">
          <AdminInput name="imageUrl" defaultValue={section?.imageUrl ?? ""} />
        </AdminField>
        <AdminField label="Subtitulo" full>
          <AdminTextarea name="subtitle" defaultValue={section?.subtitle ?? ""} />
        </AdminField>
        <AdminField label="Texto boton">
          <AdminInput
            name="buttonText"
            defaultValue={section?.buttonText ?? ""}
          />
        </AdminField>
        <AdminField label="URL boton">
          <AdminInput name="buttonUrl" defaultValue={section?.buttonUrl ?? ""} />
        </AdminField>
        <AdminField label="Inicia">
          <AdminInput
            type="datetime-local"
            name="startsAt"
            defaultValue={formatDateTimeLocal(section?.startsAt)}
          />
        </AdminField>
        <AdminField label="Termina">
          <AdminInput
            type="datetime-local"
            name="endsAt"
            defaultValue={formatDateTimeLocal(section?.endsAt)}
          />
        </AdminField>
        <AdminCheckbox
          name="isActive"
          label="Activa"
          defaultChecked={section?.isActive ?? true}
        />
      </AdminFormGrid>
      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}
