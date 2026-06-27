import { AdminCard } from "@/components/admin/AdminCard";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { createProductAction } from "@/app/(admin)/admin/actions/products.actions";
import { getAdminProductFormOptions } from "@/services/admin/product-admin.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type NewProductPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const [params, options] = await Promise.all([
    searchParams,
    getAdminProductFormOptions(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Nuevo producto"
        description="Crea el producto y una variante default para iniciar inventario."
      />
      <AdminNotice error={params.error} saved={params.saved} />
      <AdminCard>
        <AdminProductForm
          action={createProductAction}
          categories={options.categories}
          audiences={options.audiences}
          submitLabel="Crear producto"
          includeDefaultVariant
        />
      </AdminCard>
    </>
  );
}
