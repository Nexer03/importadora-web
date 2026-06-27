import Stripe from "stripe";

/**
 * Cliente de Stripe (Checkout Sessions, flujo hospedado/redireccion).
 * Toda la comunicacion ocurre en backend. No se exponen secretos al cliente.
 * Se omite `payment_method_types` a proposito para habilitar metodos de pago
 * dinamicos (configurables desde el Dashboard de Stripe).
 */

export class StripeError extends Error {}

let client: Stripe | null = null;

function getClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new StripeError("Falta STRIPE_SECRET_KEY en el entorno.");
  }
  if (!client) {
    // Sin apiVersion explicita: el SDK usa su version fijada (la mas reciente).
    client = new Stripe(key);
  }
  return client;
}

export type CreatedStripeSession = {
  id: string;
  url: string;
};

export async function createCheckoutSession(params: {
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CreatedStripeSession> {
  const stripe = getClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: Math.round(params.amount * 100),
          product_data: { name: params.description },
        },
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.orderNumber,
    metadata: { orderNumber: params.orderNumber },
  });

  if (!session.url) {
    throw new StripeError("Stripe no devolvio una URL de checkout.");
  }

  return { id: session.id, url: session.url };
}

export type StripeSessionStatus = {
  paid: boolean;
  status: string;
  paymentIntentId: string | null;
  payerEmail: string | null;
  raw: string;
};

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<StripeSessionStatus> {
  const stripe = getClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  return {
    paid: session.payment_status === "paid",
    status: session.payment_status ?? "unknown",
    paymentIntentId,
    payerEmail: session.customer_details?.email ?? null,
    raw: JSON.stringify(session),
  };
}
