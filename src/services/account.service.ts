import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import {
  getUserPasswordHash,
  updateUserName,
  updateUserPassword,
} from "@/repositories/auth.repository";
import { getOrdersByUserId } from "@/repositories/order.repository";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/validators/account.validator";

export class AccountError extends Error {}

export type CustomerOrderDTO = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: Date;
};

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return null;
  }
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? "",
    role: user.role,
  };
}

export async function customerHasPassword(): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return false;
  }
  const user = await getUserPasswordHash(userId);
  return Boolean(user?.passwordHash);
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new AccountError("Necesitas iniciar sesion.");
  }
  return userId;
}

export async function updateCustomerProfile(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    throw new AccountError(
      parsed.error.issues[0]?.message ?? "Datos invalidos."
    );
  }
  await updateUserName(userId, parsed.data.name);
}

export async function changeCustomerPassword(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    throw new AccountError(
      parsed.error.issues[0]?.message ?? "Datos invalidos."
    );
  }

  const current = await getUserPasswordHash(userId);
  // Si ya tiene contrasena (cuenta de correo), se exige la actual correcta.
  if (current?.passwordHash) {
    const ok = parsed.data.currentPassword
      ? await bcrypt.compare(parsed.data.currentPassword, current.passwordHash)
      : false;
    if (!ok) {
      throw new AccountError("La contrasena actual es incorrecta.");
    }
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await updateUserPassword(userId, passwordHash);
}

export async function getCustomerOrders(): Promise<CustomerOrderDTO[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return [];
  }

  const orders = await getOrdersByUserId(userId);
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: Number(order.total.toString()),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  }));
}
