import Link from "next/link";

import { AdminBadge } from "@/components/admin/AdminBadge";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/AdminTable";
import { getAdminOrderDashboard } from "@/services/admin/order-admin.service";
import { getAdminDashboardData } from "@/services/admin/product-admin.service";
import { formatMXN } from "@/utils/format";
import {
  labelFor,
  orderStatusLabels,
  orderStatusTone,
} from "@/utils/order-labels";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const [data, orderData] = await Promise.all([
    getAdminDashboardData(),
    getAdminOrderDashboard(),
  ]);

  const orderCards = [
    { label: "Ventas de hoy", value: formatMXN(orderData.metrics.todaySales) },
    { label: "Pendientes de pago", value: orderData.metrics.pendingPayment },
    { label: "Pagados", value: orderData.metrics.paid },
    { label: "Por preparar", value: orderData.metrics.preparing },
    { label: "Enviados", value: orderData.metrics.shipped },
  ];

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderCards.map((card) => (
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
        <AdminCard title="Ultimos pedidos">
          {orderData.recentOrders.length === 0 ? (
            <p className="text-sm text-zinc-600">Aun no hay pedidos.</p>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>Pedido</AdminTh>
                  <AdminTh>Cliente</AdminTh>
                  <AdminTh>Estado</AdminTh>
                  <AdminTh>Total</AdminTh>
                  <AdminTh>Accion</AdminTh>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orderData.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <AdminTd>{order.orderNumber}</AdminTd>
                    <AdminTd>{order.customerName}</AdminTd>
                    <AdminTd>
                      <AdminBadge tone={orderStatusTone(order.status)}>
                        {labelFor(orderStatusLabels, order.status)}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd>{formatMXN(order.total)}</AdminTd>
                    <AdminTd>
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="font-bold text-zinc-950 underline"
                      >
                        Ver
                      </Link>
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          )}
        </AdminCard>
      </div>

      <h2 className="mt-10 text-sm font-black uppercase tracking-wide text-zinc-500">
        Catalogo
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
