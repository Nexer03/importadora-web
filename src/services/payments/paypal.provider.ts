import {
  capturePayPalOrder,
  createPayPalOrder,
  PayPalError,
} from "@/lib/paypal";

import {
  PaymentError,
  type CapturedPayment,
  type CreatedPayment,
  type CreatePaymentParams,
  type PaymentProvider,
} from "./provider";

/**
 * Implementacion de PaymentProvider para PayPal (Orders v2, redireccion).
 */
export const paypalProvider: PaymentProvider = {
  name: "paypal",

  async createPayment(params: CreatePaymentParams): Promise<CreatedPayment> {
    try {
      const order = await createPayPalOrder({
        orderNumber: params.orderNumber,
        amount: params.amount,
        description: params.description,
        returnUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
      });
      return { reference: order.id, redirectUrl: order.approveUrl };
    } catch (error) {
      if (error instanceof PayPalError) {
        throw new PaymentError(error.message);
      }
      throw error;
    }
  },

  async capturePayment(reference: string): Promise<CapturedPayment> {
    const result = await capturePayPalOrder(reference);
    return {
      completed: result.completed,
      status: result.status,
      transactionId: result.captureId,
      payerEmail: result.payerEmail,
      raw: result.raw,
    };
  },
};
