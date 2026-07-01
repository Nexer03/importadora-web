import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaEnvLogged?: boolean;
};

/**
 * Diagnostico de arranque: imprime (una sola vez, sin exponer la contrasena)
 * a que host / usuario / base esta apuntando DATABASE_URL en runtime.
 * Sirve para confirmar en el log del hosting si la app lee la variable
 * correcta o esta tomando otra configuracion (p.ej. un .env viejo).
 */
if (!globalForPrisma.prismaEnvLogged) {
  globalForPrisma.prismaEnvLogged = true;
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error("[db] DATABASE_URL no esta definida en runtime.");
  } else {
    try {
      const u = new URL(raw);
      console.log(
        `[db] DATABASE_URL OK -> host=${u.host} user=${u.username} db=${u.pathname.slice(1)}`
      );
    } catch {
      console.error("[db] DATABASE_URL invalida (no se pudo parsear la URL).");
    }
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
