import { OrderStatus } from "@prisma/client";

import {
  getAdminOrderById,
  getAdminOrders,
  getOrderMetrics,
  updateOrderNotes,
  updateOrderShipping,
  updateOrderStatus,
  type AdminOrderListRow,
  type AdminOrderWithRelations,
} from "@/repositories/admin/order-admin.repository";
import { requireAdminAccess } from "@/services/admin.guard";
import {
  updateOrderNotesSchema,
  updateOrderShippingSchema,
  updateOrderStatusSchema,
} from "@/validators/admin/order.validator";

import { decimalToNumber, validateAdminInput } from "./admin-service-utils";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  deliveryMethod: string;
  total: number;
  itemCount: number;
  createdAt: Date;
};

export type AdminOrderItemDTO = {
  id: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type AdminPaymentDTO = {
  id: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  providerOrderId: string | null;
  providerCaptureId: string | null;
  payerEmail: string | null;
  createdAt: Date;
};

export type AdminOrderDetailDTO = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string | null;
  paymentReference: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  shippingAddress: string | null;
  postalCode: string | null;
  city: string | null;
  state: string | null;
  addressReference: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  invoiceStatus: string;
  fiscalRfc: string | null;
  fiscalName: string | null;
  fiscalPostalCode: string | null;
  fiscalRegime: string | null;
  fiscalCfdiUse: string | null;
  fiscalEmail: string | null;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  shippingCost: number;
  total: number;
  notes: string | null;
  items: AdminOrderItemDTO[];
  payments: AdminPaymentDTO[];
  createdAt: Date;
  updatedAt: Date;
};

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapListItem(order: AdminOrderListRow): AdminOrderListItem {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryMethod: order.deliveryMethod,
    total: decimalToNumber(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  };
}

function mapDetail(order: AdminOrderWithRelations): AdminOrderDetailDTO {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentProvider: order.paymentProvider,
    paymentReference: order.paymentReference,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryMethod: order.deliveryMethod,
    shippingAddress: order.shippingAddress,
    postalCode: order.postalCode,
    city: order.city,
    state: order.state,
    addressReference: order.addressReference,
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
    invoiceStatus: order.invoiceStatus,
    fiscalRfc: order.fiscalRfc,
    fiscalName: order.fiscalName,
    fiscalPostalCode: order.fiscalPostalCode,
    fiscalRegime: order.fiscalRegime,
    fiscalCfdiUse: order.fiscalCfdiUse,
    fiscalEmail: order.fiscalEmail,
    subtotal: decimalToNumber(order.subtotal),
    discountAmount: decimalToNumber(order.discountAmount),
    couponCode: order.couponCode,
    shippingCost: decimalToNumber(order.shippingCost),
    total: decimalToNumber(order.total),
    notes: order.notes,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      unitPrice: decimalToNumber(item.unitPrice),
      quantity: item.quantity,
      lineTotal: decimalToNumber(item.lineTotal),
    })),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      provider: payment.provider,
      status: payment.status,
      amount: decimalToNumber(payment.amount),
      currency: payment.currency,
      providerOrderId: payment.providerOrderId,
      providerCaptureId: payment.providerCaptureId,
      payerEmail: payment.payerEmail,
      createdAt: payment.createdAt,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function getAdminOrdersList() {
  await requireAdminAccess();
  const orders = await getAdminOrders();
  return orders.map(mapListItem);
}

export async function getAdminOrderDashboard() {
  await requireAdminAccess();
  const [metrics, orders] = await Promise.all([
    getOrderMetrics(),
    getAdminOrders(),
  ]);
  return {
    metrics,
    recentOrders: orders.slice(0, 5).map(mapListItem),
  };
}

export async function getAdminOrderDetail(id: string) {
  await requireAdminAccess();
  const order = await getAdminOrderById(id);
  return order ? mapDetail(order) : null;
}

export async function updateAdminOrderStatus(id: string, raw: unknown) {
  await requireAdminAccess();
  const { status } = validateAdminInput(updateOrderStatusSchema, raw);
  return updateOrderStatus(id, status as OrderStatus);
}

export async function updateAdminOrderShipping(id: string, raw: unknown) {
  await requireAdminAccess();
  const data = validateAdminInput(updateOrderShippingSchema, raw);
  return updateOrderShipping(
    id,
    emptyToNull(data.carrier),
    emptyToNull(data.trackingNumber)
  );
}

export async function updateAdminOrderNotes(id: string, raw: unknown) {
  await requireAdminAccess();
  const data = validateAdminInput(updateOrderNotesSchema, raw);
  return updateOrderNotes(id, emptyToNull(data.notes));
}
