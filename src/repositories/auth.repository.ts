import { prisma } from "@/lib/prisma";

export function getUserForCredentials(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
    },
  });
}

export function getAdminUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

/**
 * Crea o actualiza un usuario CUSTOMER a partir de su perfil de Google.
 * No toca el rol si el usuario ya existe (un admin que entre con Google sigue
 * siendo admin).
 */
export function upsertGoogleCustomer(data: {
  email: string;
  name: string | null;
  image: string | null;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name ?? undefined,
      image: data.image ?? undefined,
    },
    create: {
      email: data.email,
      name: data.name,
      image: data.image,
      role: "CUSTOMER",
    },
    select: { id: true, role: true, isActive: true },
  });
}
