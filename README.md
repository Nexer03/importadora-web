# Importadora Web

E-commerce desarrollado con Next.js, TypeScript, Tailwind CSS, Prisma y MySQL/MariaDB.

## Tecnologías principales

* Next.js
* TypeScript
* Tailwind CSS
* Prisma
* MySQL / MariaDB
* Node.js
* npm

## Requisitos previos

Antes de ejecutar el proyecto, se debe tener instalado:

* Node.js
* npm
* MySQL o MariaDB
* Git

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta del proyecto:

```bash
cd importadora-web
```

Instalar dependencias:

```bash
npm install
```

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
DATABASE_URL="mysql://root:TU_PASSWORD@127.0.0.1:3306/importadora_dev"

APP_URL="http://localhost:3000"

NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_PUBLIC_KEY=""
```

> El archivo `.env` no debe subirse al repositorio.

## Creación de base de datos local

Crear una base de datos vacía en MySQL/MariaDB:

```sql
CREATE DATABASE IF NOT EXISTS importadora_dev
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## Ejecutar migraciones

Aplicar las migraciones de Prisma:

```bash
npx prisma migrate dev
```

## Ejecutar seeders

Cargar datos iniciales:

```bash
npm run db:seed
```

## Ver base de datos con Prisma Studio

Ejecutar:

```bash
npm run db:studio
```

Esto abrirá Prisma Studio en el navegador para revisar las tablas y registros.

## Ejecutar el proyecto en desarrollo

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:3000
```

## Compilar el proyecto

Antes de subir cambios importantes, validar que el proyecto compile correctamente:

```bash
npm run build
```

## Flujo de trabajo con ramas

Ramas principales:

```txt
master   = producción
dev      = desarrollo integrado
chuy     = rama de trabajo personal
gabriel  = rama de trabajo personal
```

Para actualizar la rama local:

```bash
git checkout dev
git pull origin dev
```

Para crear una rama nueva de trabajo:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/nombre-de-la-tarea
```

## Cuando existan cambios en base de datos

Después de hacer `pull` de cambios que incluyan migraciones nuevas:

```bash
npx prisma migrate dev
npm run db:seed
```

## Scripts útiles

```bash
npm run dev
```

Ejecuta el servidor de desarrollo.

```bash
npm run build
```

Compila el proyecto.

```bash
npm run start
```

Ejecuta el proyecto compilado.

```bash
npm run db:seed
```

Ejecuta los seeders de Prisma.

```bash
npm run db:studio
```

Abre Prisma Studio.

```bash
npm run db:reset
```

Reinicia la base de datos local y vuelve a correr migraciones y seeders.

> Usar `db:reset` solo en desarrollo local, nunca en producción.

## Notas importantes

* No subir archivos `.env`.
* No modificar migraciones antiguas que ya estén en el repositorio.
* Cada cambio en `schema.prisma` debe generar una nueva migración.
* La lógica de negocio debe ir en `src/services`.
* El acceso a base de datos debe ir en `src/repositories`.
* Los componentes visuales no deben contener lógica crítica de negocio.
* La arquitectura debe mantenerse compatible con una futura aplicación móvil.
