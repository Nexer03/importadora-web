/**
 * Abstraccion de proveedor de pago. Permite soportar varios proveedores
 * (PayPal hoy; Stripe / Mercado Pago en el futuro) sin acoplar el checkout a
 * uno especifico. Cada proveedor implementa esta interfaz y se registra en
 * `registry.ts`. El `Order.paymentProvider` guarda el nombre para resolver el
 * proveedor correcto al confirmar el pago.
 */

export class PaymentError extends Error {}

export type CreatePaymentParams = {
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
};

export type CreatedPayment = {
  /** Referencia del proveedor (p.ej. id de orden PayPal o session de Stripe). */
  reference: string;
  /** URL a la que se redirige al cliente para pagar. */
  redirectUrl: string;
};

export type CapturedPayment = {
  completed: boolean;
  status: string;
  /** Id de la transaccion/captura del proveedor. */
  transactionId: string | null;
  payerEmail: string | null;
  raw: string;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(params: CreatePaymentParams): Promise<CreatedPayment>;
  capturePayment(reference: string): Promise<CapturedPayment>;
}
