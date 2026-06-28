import {
  createStoreSettingAction,
  upsertStoreSettingAction,
} from "@/app/(admin)/admin/actions/settings.actions";
import { AdminCard } from "@/components/admin/AdminCard";
import {
  AdminField,
  AdminInput,
  AdminSubmitButton,
} from "@/components/admin/AdminForm";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminStoreSettingsList } from "@/services/admin/settings-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const [params, settings] = await Promise.all([
    searchParams,
    getAdminStoreSettingsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Valores key/value usados por la tienda y el contenido publico."
      />
      <AdminNotice error={params.error} saved={params.saved} />
      <div className="grid gap-6">
        <AdminCard title="Settings existentes y comunes">
          <div className="grid gap-4">
            {settings.map((setting) => (
              <form
                key={setting.key}
                action={upsertStoreSettingAction}
                className="grid gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[220px_1fr_auto] sm:items-end"
              >
                <AdminField label="Key">
                  <AdminInput name="key" value={setting.key} readOnly />
                </AdminField>
                <AdminField label="Value">
                  <AdminInput name="value" defaultValue={setting.value} />
                </AdminField>
                <AdminSubmitButton>
                  {setting.exists ? "Guardar" : "Crear"}
                </AdminSubmitButton>
              </form>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Nuevo setting">
          <form action={createStoreSettingAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <AdminField label="Key">
              <AdminInput name="key" required />
            </AdminField>
            <AdminField label="Value">
              <AdminInput name="value" required />
            </AdminField>
            <AdminSubmitButton>Crear setting</AdminSubmitButton>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
