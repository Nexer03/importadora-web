import {
  cancelOrderAndRestoreCart,
  getOrderByNumber,
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/repositories/order.repository";
import {
  getPaymentProvider,
  getStoreCurrency,
} from "@/services/payments/registry";

export type PaymentResult =
  | "paid"
  | "failed"
  | "already_paid"
  | "not_found"
  | "invalid";

function orderAmount(total: { toString(): string }): number {
  return Number(total.toString());
}

/**
 * Confirma el pago capturando contra el proveedor en backend (no se confia en
 * la redireccion del cliente). El proveedor se resuelve desde la orden, asi que
 * funciona para PayPal hoy y cualquier proveedor futuro (Stripe, etc.).
 * Idempotente: si ya estaba pagada, no recaptura.
 */
export async function confirmPayment(
  orderNumber: string
): Promise<{ result: PaymentResult; orderNumber: string }> {
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return { result: "not_found", orderNumber };
  }
  if (order.status === "PAID") {
    return { result: "already_paid", orderNumber };
  }
  if (
    order.status !== "PENDING_PAYMENT" ||
    !order.paymentReference ||
    !order.paymentProvider
  ) {
    return { result: "invalid", orderNumber };
  }

  const provider = getPaymentProvider(order.paymentProvider);
  const currency = getStoreCurrency();
  const amount = orderAmount(order.total);

  let capture;
  try {
    capture = await provider.capturePayment(order.paymentReference);
  } catch (error) {
    await markOrderPaymentFailed(order.id, {
      providerOrderId: order.paymentReference,
      captureId: null,
      payerEmail: null,
      raw: error instanceof Error ? error.message : "capture error",
      amount,
      currency,
      status: "CAPTURE_ERROR",
    });
    return { result: "failed", orderNumber };
  }

  if (capture.completed) {
    await markOrderPaid(order.id, {
      providerOrderId: order.paymentReference,
      captureId: capture.transactionId,
      payerEmail: capture.payerEmail,
      raw: capture.raw,
      amount,
      currency,
    });
    return { result: "paid", orderNumber };
  }

  await markOrderPaymentFailed(order.id, {
    providerOrderId: order.paymentReference,
    captureId: capture.transactionId,
    payerEmail: capture.payerEmail,
    raw: capture.raw,
    amount,
    currency,
    status: capture.status,
  });
  return { result: "failed", orderNumber };
}

/**
 * Cancela el pago: libera el stock reservado y recrea el carrito del cliente.
 * Solo aplica a ordenes que siguen pendientes de pago. Es independiente del
 * proveedor.
 */
export async function cancelPayment(orderNumber: string): Promise<void> {
  const order = await getOrderByNumber(orderNumber);
  if (order && order.status === "PENDING_PAYMENT") {
    await cancelOrderAndRestoreCart(order.id);
  }
}
