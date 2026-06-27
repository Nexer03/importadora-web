import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  getAdminUserById,
  getUserForCredentials,
} from "@/repositories/auth.repository";
import {
  adminLoginSchema,
  type AdminLoginInput,
} from "@/validators/auth.validator";

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

export async function getActiveAdminUserById(
  id: string
): Promise<AuthAdminUser | null> {
  const user = await getAdminUserById(id);

  if (!user || user.role !== UserRole.ADMIN || !user.isActive) {
    return null;
  }

  return user;
}
