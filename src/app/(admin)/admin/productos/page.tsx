import Link from "next/link";

import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/AdminTable";
import { getAdminProductsList } from "@/services/admin/product-admin.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductsAdminPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(date);
}

export default async function AdminProductsPage({
  searchParams,
}: ProductsAdminPageProps) {
  const [params, products] = await Promise.all([
    searchParams,
    getAdminProductsList(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Productos"
        description="Catalogo completo con status, precios, variantes e inventario visible."
        actionHref="/admin/productos/nuevo"
        actionLabel="Nuevo producto"
      />
      <AdminNotice error={params.error} saved={params.saved} />

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-zinc-600">
            Aun no hay productos creados.
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-bold text-white"
          >
            Crear producto
          </Link>
        </div>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Nombre</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Categoria</AdminTh>
              <AdminTh>Publico</AdminTh>
              <AdminTh>Precio</AdminTh>
              <AdminTh>Stock</AdminTh>
              <AdminTh>Featured</AdminTh>
              <AdminTh>New</AdminTh>
              <AdminTh>Creado</AdminTh>
              <AdminTh>Accion</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {products.map((product) => (
              <tr key={product.id}>
                <AdminTd>{product.name}</AdminTd>
                <AdminTd>
                  <AdminBadge
                    tone={
                      product.status === "PUBLISHED"
                        ? "success"
                        : product.status === "ARCHIVED"
                          ? "muted"
                          : "warning"
                    }
                  >
                    {product.status}
                  </AdminBadge>
                </AdminTd>
                <AdminTd>{product.categoryName}</AdminTd>
                <AdminTd>{product.audienceName}</AdminTd>
                <AdminTd>{formatMXN(product.basePrice)}</AdminTd>
                <AdminTd>{product.stockAvailable}</AdminTd>
                <AdminTd>{product.isFeatured ? "Si" : "No"}</AdminTd>
                <AdminTd>{product.isNew ? "Si" : "No"}</AdminTd>
                <AdminTd>{formatDate(product.createdAt)}</AdminTd>
                <AdminTd>
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="font-bold text-zinc-950 underline"
                  >
                    Editar
                  </Link>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}
