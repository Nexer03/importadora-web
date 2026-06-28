import {
  createCheckoutSession,
  retrieveCheckoutSession,
} from "@/lib/stripe";

import {
  PaymentError,
  type CapturedPayment,
  type CreatedPayment,
  type CreatePaymentParams,
  type PaymentProvider,
} from "./provider";

/**
 * Implementacion de PaymentProvider para Stripe usando Checkout Sessions
 * (hospedado, con redireccion). La confirmacion se hace recuperando la sesion
 * en backend (payment_status === "paid"), no se confia en el cliente.
 */
export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createPayment(params: CreatePaymentParams): Promise<CreatedPayment> {
    try {
      const session = await createCheckoutSession({
        orderNumber: params.orderNumber,
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        successUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
      });
      return { reference: session.id, redirectUrl: session.url };
    } catch (error) {
      throw new PaymentError(
        error instanceof Error ? error.message : "Error al crear el pago en Stripe."
      );
    }
  },

  async capturePayment(reference: string): Promise<CapturedPayment> {
    const result = await retrieveCheckoutSession(reference);
    return {
      completed: result.paid,
      status: result.status,
      transactionId: result.paymentIntentId,
      payerEmail: result.payerEmail,
      raw: result.raw,
    };
  },
};
