export type DeliveryMethodDTO =
  | "NATIONAL_SHIPPING"
  | "LOCAL_DELIVERY"
  | "LOCAL_PICKUP";

export type OrderItemDTO = {
  id: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethodDTO;
  shippingAddress: string | null;
  postalCode: string | null;
  city: string | null;
  state: string | null;
  addressReference: string | null;
  invoiceStatus: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItemDTO[];
  createdAt: string;
};

export type ShippingOption = {
  method: DeliveryMethodDTO;
  label: string;
  description: string;
  cost: number;
};
