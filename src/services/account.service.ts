import { auth } from "@/lib/auth";
import { getOrdersByUserId } from "@/repositories/order.repository";

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
