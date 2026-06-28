export const orderStatusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PREPARING: "En preparacion",
  READY_FOR_PICKUP: "Listo para recoleccion",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  PAYMENT_FAILED: "Pago fallido",
  REFUNDED: "Reembolsado",
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  CHARGEBACK: "Contracargo",
  IN_REVIEW: "En revision",
};

export const deliveryMethodLabels: Record<string, string> = {
  NATIONAL_SHIPPING: "Envio nacional",
  LOCAL_DELIVERY: "Entrega local",
  LOCAL_PICKUP: "Recoleccion local",
};

export function orderStatusTone(
  status: string
): "default" | "success" | "warning" | "muted" | "danger" {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "success";
    case "CANCELLED":
    case "PAYMENT_FAILED":
    case "REFUNDED":
      return "danger";
    case "PENDING_PAYMENT":
      return "warning";
    default:
      return "default";
  }
}

export function paymentStatusTone(
  status: string
): "default" | "success" | "warning" | "muted" | "danger" {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
    case "CHARGEBACK":
      return "danger";
    case "PENDING":
    case "IN_REVIEW":
      return "warning";
    default:
      return "muted";
  }
}

export function labelFor(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
