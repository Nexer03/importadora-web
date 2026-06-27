# Codex handoff: admin auth

## Implementado

- Autenticacion real de administradores con Auth.js / NextAuth v5 y Credentials Provider.
- Login por `email` y `password` en `/login`.
- Ruta Auth.js en `/api/auth/[...nextauth]`.
- Guard real en `src/services/admin.guard.ts`.
- Proteccion server-side de todo `/admin` desde `src/app/(admin)/admin/layout.tsx`.
- Logout desde el header del panel admin.
- Tipado de `session.user.id`, `session.user.role` y `session.user.isActive`.
- Pagina simple de acceso denegado en `/access-denied`.
- Validacion Zod de credenciales.
- Service/repository de auth para no consultar Prisma desde componentes visuales.

## Archivos creados o modificados

- `package.json`
- `package-lock.json`
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/access-denied/page.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/repositories/auth.repository.ts`
- `src/services/auth.service.ts`
- `src/services/admin.guard.ts`
- `src/types/next-auth.d.ts`
- `src/validators/auth.validator.ts`
- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/actions/auth.actions.ts`
- `src/components/admin/AdminHeader.tsx`
- `src/components/admin/AdminShell.tsx`

## Dependencia agregada

```txt
next-auth@5.0.0-beta.31
```

## Variables necesarias

`.env.example` ya contiene:

```env
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

No se modifico `.env`. Para probar localmente, `NEXTAUTH_SECRET` debe tener un valor definido en el entorno real. No se genero ni guardo ningun secreto real en codigo.

## Como iniciar sesion

1. Asegurar que el seed haya creado el admin:

```bash
npm run db:seed
```

2. Ejecutar el proyecto:

```bash
npm run dev
```

3. Abrir:

```txt
http://localhost:3000/login
```

Admin seed por defecto:

```txt
email: admin@importadora.local
password: Admin123!
```

Si existen `SEED_ADMIN_EMAIL` o `SEED_ADMIN_PASSWORD`, el seed usa esos valores.

## Rutas protegidas

Todo lo que cuelga de `/admin` queda protegido por el layout admin. Un usuario sin sesion va a:

```txt
/login?callbackUrl=/admin
```

Un usuario autenticado que no sea admin activo va a:

```txt
/access-denied
```

## Logout

El header del panel muestra el nombre/email del admin y el boton `Cerrar sesion`. Al cerrar sesion redirige a `/login`.

## Decisiones tecnicas

- Se uso Credentials Provider porque el flujo requerido es admin email/password.
- No se uso PrismaAdapter. Con Credentials Provider se usa estrategia JWT; esto evita cambios de schema y migraciones.
- `requireAdminAccess()` revalida el usuario contra la base de datos usando el `id` de la sesion, para bloquear admins desactivados o roles cambiados despues del login.
- La sesion expone solo datos minimos de usuario. `passwordHash` no se expone.
- El mensaje de error de login es generico: `Credenciales invalidas`.

## Validacion realizada

- `npm run build`: passed.
- `/login`: responde 200.
- `/admin` sin sesion: responde 307 hacia `/login?callbackUrl=/admin`.
- Login con admin seed: permite entrar a `/admin`.
- Login invalido: no abre `/admin`.
- `/api/auth/session`: no contiene `passwordHash`.
- `/`: sigue respondiendo 200.

## No implementado

- Login de cliente.
- Google login.
- Registro publico.
- Carrito real.
- Checkout.
- Mercado Pago.
- Pagos.

## Siguiente paso recomendado

Despues de auth admin, continuar con carrito real y modelo de ordenes. No conviene implementar Mercado Pago todavia hasta tener carrito, orden persistida, totales confiables, inventario reservado y estados de pedido definidos.
