import { auth } from "@/lib/auth";
import {
  getActiveAdminUserById,
  type AuthAdminUser,
} from "@/services/auth.service";

export class AdminAccessError extends Error {
  constructor(
    public readonly reason: "UNAUTHENTICATED" | "FORBIDDEN",
    message = "Admin access denied."
  ) {
    super(message);
    this.name = "AdminAccessError";
  }
}

export function isAdminAccessError(error: unknown): error is AdminAccessError {
  return error instanceof AdminAccessError;
}

export async function requireAdminAccess(): Promise<AuthAdminUser> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AdminAccessError("UNAUTHENTICATED");
  }

  const adminUser = await getActiveAdminUserById(userId);

  if (!adminUser) {
    throw new AdminAccessError("FORBIDDEN");
  }

  return adminUser;
}
