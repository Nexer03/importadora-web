import { z } from "zod";

export const orderStatuses = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
  "REFUNDED",
] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses, { message: "Estado de pedido invalido" }),
});

export const updateOrderShippingSchema = z.object({
  carrier: z.string().trim().max(80).optional().or(z.literal("")),
  trackingNumber: z.string().trim().max(120).optional().or(z.literal("")),
});

export const updateOrderNotesSchema = z.object({
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
