import Link from "next/link";

import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/AdminTable";
import { getAdminDashboardData } from "@/services/admin/product-admin.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  const cards = [
    { label: "Total productos", value: data.stats.total },
    { label: "Publicados", value: data.stats.published },
    { label: "Borrador", value: data.stats.draft },
    { label: "Archivados", value: data.stats.archived },
    { label: "Categorias activas", value: data.stats.activeCategories },
    { label: "Colecciones activas", value: data.stats.activeCollections },
    { label: "Bajo stock", value: data.stats.lowStock },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Vista rapida del catalogo y contenido base."
        actionHref="/admin/productos/nuevo"
        actionLabel="Nuevo producto"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AdminCard key={card.label}>
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-black text-zinc-950">
              {card.value}
            </p>
          </AdminCard>
        ))}
      </div>

      <div className="mt-8">
        <AdminCard title="Ultimos productos creados">
          {data.latestProducts.length === 0 ? (
            <p className="text-sm text-zinc-600">Aun no hay productos.</p>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>Producto</AdminTh>
                  <AdminTh>Status</AdminTh>
                  <AdminTh>Precio</AdminTh>
                  <AdminTh>Stock</AdminTh>
                  <AdminTh>Fecha</AdminTh>
                  <AdminTh>Accion</AdminTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {data.latestProducts.map((product) => (
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
                    <AdminTd>{formatMXN(product.basePrice)}</AdminTd>
                    <AdminTd>{product.stockAvailable}</AdminTd>
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
        </AdminCard>
      </div>
    </>
  );
}
