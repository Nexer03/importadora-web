import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  createCustomerUser,
  getAdminUserById,
  getUserByEmail,
  getUserForCredentials,
  upsertGoogleCustomer,
} from "@/repositories/auth.repository";
import {
  adminLoginSchema,
  registerSchema,
  type AdminLoginInput,
} from "@/validators/auth.validator";

export class RegisterError extends Error {}

export type AuthAdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export async function validateAdminCredentials(
  input: unknown
): Promise<AuthAdminUser | null> {
  const parsed = adminLoginSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const credentials: AdminLoginInput = {
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  };
  const user = await getUserForCredentials(credentials.email);

  if (
    !user ||
    !user.passwordHash ||
    user.role !== UserRole.ADMIN ||
    !user.isActive
  ) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}

/**
 * Valida credenciales de CUALQUIER usuario activo (admin o cliente) con
 * contrasena. Devuelve sus datos de sesion con su rol. Las areas admin siguen
 * protegidas por separado con requireAdminAccess.
 */
export async function validateUserCredentials(
  input: unknown
): Promise<AuthAdminUser | null> {
  const parsed = adminLoginSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const email = parsed.data.email.toLowerCase();
  const user = await getUserForCredentials(email);

  if (!user || !user.passwordHash || !user.isActive) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}

/**
 * Registra un nuevo cliente (rol CUSTOMER) con email y contrasena.
 */
export async function registerCustomer(
  input: unknown
): Promise<{ email: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    throw new RegisterError(
      parsed.error.issues[0]?.message ?? "Datos invalidos."
    );
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new RegisterError("Ya existe una cuenta con ese correo.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await createCustomerUser({
    name: parsed.data.name,
    email,
    passwordHash,
  });

  return { email: user.email };
}

export async function getActiveAdminUserById(
  id: string
): Promise<AuthAdminUser | null> {
  const user = await getAdminUserById(id);

  if (!user || user.role !== UserRole.ADMIN || !user.isActive) {
    return null;
  }

  return user;
}

export type AuthUser = {
  id: string;
  role: UserRole;
  isActive: boolean;
};

/**
 * Crea/actualiza el usuario CUSTOMER del perfil de Google y devuelve sus datos
 * de sesion (id real de la BD, rol y estado).
 */
export async function upsertGoogleUser(profile: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<AuthUser> {
  return upsertGoogleCustomer({
    email: profile.email.toLowerCase(),
    name: profile.name ?? null,
    image: profile.image ?? null,
  });
}

export async function getActiveUserByEmail(
  email: string
): Promise<AuthUser | null> {
  const user = await getUserByEmail(email.toLowerCase());
  if (!user || !user.isActive) {
    return null;
  }
  return { id: user.id, role: user.role, isActive: user.isActive };
}
