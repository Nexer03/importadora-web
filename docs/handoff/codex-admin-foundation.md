# Codex handoff: admin foundation

## Implementado

- Guard temporal de admin en `src/services/admin.guard.ts`.
- Validadores Zod para productos, variantes, imagenes, categorias, publicos, colecciones, home sections y settings.
- Repositories admin para CRUD y relaciones sin usar Prisma directo desde UI/actions.
- Services admin con `requireAdminAccess()`, validacion Zod, normalizacion de slugs y DTOs seguros para UI.
- Server Actions para formularios admin con `revalidatePath` y redirects.
- Layout admin con sidebar responsive, header, cards, tablas, badges, avisos y formularios reutilizables.
- Dashboard admin con metricas de productos, categorias, colecciones, bajo stock y ultimos productos.
- CRUD base para:
  - Productos
  - Variantes
  - Imagenes por URL
  - Categorias
  - Publicos/audiences
  - Colecciones
  - Home sections
  - Store settings

## Rutas admin disponibles

- `/admin`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/[id]`
- `/admin/categorias`
- `/admin/categorias/nueva`
- `/admin/categorias/[id]`
- `/admin/publicos`
- `/admin/publicos/nuevo`
- `/admin/publicos/[id]`
- `/admin/colecciones`
- `/admin/colecciones/nueva`
- `/admin/colecciones/[id]`
- `/admin/home`
- `/admin/home/nuevo`
- `/admin/home/[id]`
- `/admin/settings`

## Archivos principales creados

- `src/services/admin.guard.ts`
- `src/validators/admin/*`
- `src/repositories/admin/*`
- `src/services/admin/*`
- `src/app/(admin)/admin/actions/*`
- `src/app/(admin)/admin/**/page.tsx`
- `src/app/(admin)/admin/layout.tsx`
- `src/components/admin/*`

## Decisiones tomadas

- El panel no implementa login real todavia. `requireAdminAccess()` permite acceso en `development` y bloquea en production hasta integrar auth.
- Productos no se eliminan fisicamente; la accion disponible los marca como `ARCHIVED`.
- Categorias, publicos y colecciones se desactivan si tienen relaciones para no romper productos existentes.
- Imagenes de producto usan URL, sin upload de archivos.
- `free_shipping_min_amount` aparece como setting editable comun, pero no se muestra ni activa ninguna promesa publica por si solo.
- No se agregaron dependencias de formularios ni UI.
- No se modifico `prisma/schema.prisma`.
- No se crearon migraciones.
- No se toco `.env`.

## Como probar

```bash
npm run dev
```

Abrir:

```txt
http://localhost:3000/admin
```

Flujo sugerido:

1. Crear o revisar categorias en `/admin/categorias`.
2. Crear o revisar publicos en `/admin/publicos`.
3. Crear producto en `/admin/productos/nuevo`.
4. Editar variantes, imagenes y colecciones desde `/admin/productos/[id]`.
5. Publicar producto cambiando `status` a `PUBLISHED`.
6. Verificar que aparezca en `/productos` y, si aplica, en home.

## Validacion

```bash
npm run build
```

Resultado actual:

```txt
npm run build: passed
```

## Falta implementar

- Autenticacion real de admin.
- Roles/permisos reales.
- Confirmaciones client-side antes de acciones destructivas.
- Paginacion y busqueda en tablas admin.
- Upload real de imagenes.
- Auditoria de cambios.
- Carrito real.
- Orders/checkout.
- Pagos y Mercado Pago.

## Siguiente paso recomendado

El siguiente paso recomendado es **implementar autenticacion real de admin** antes de seguir aumentando capacidades sensibles del panel.

Despues de proteger el admin, el orden recomendado es:

1. Implementar carrito real.
2. Implementar orders/checkout.
3. Integrar Mercado Pago.

No conviene implementar Mercado Pago todavia hasta tener carrito y ordenes definidos, porque el pago necesita una orden persistida, totales confiables, inventario reservado y estados de pedido claros.
