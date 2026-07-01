/**
 * Cliente minimo de PayPal REST (Orders v2) para el flujo de redireccion.
 * Toda la comunicacion con PayPal ocurre en backend. No se exponen secretos
 * al cliente.
 */

export class PayPalError extends Error {}

type PayPalConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  currency: string;
};

function getConfig(): PayPalConfig {
  const env = (process.env.PAYPAL_ENV ?? "sandbox").toLowerCase();
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const currency = process.env.PAYPAL_CURRENCY ?? "MXN";

  if (!clientId || !clientSecret) {
    throw new PayPalError("Faltan credenciales de PayPal en el entorno.");
  }

  const baseUrl =
    env === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  return { baseUrl, clientId, clientSecret, currency };
}

export function getPayPalCurrency(): string {
  return process.env.PAYPAL_CURRENCY ?? "MXN";
}

async function getAccessToken(config: PayPalConfig): Promise<string> {
  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64");

  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PayPalError(
      `No se pudo autenticar con PayPal (${response.status}).`
    );
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new PayPalError("PayPal no devolvio un token de acceso.");
  }

  return data.access_token;
}

type PayPalLink = { rel: string; href: string };

export type CreatedPayPalOrder = {
  id: string;
  approveUrl: string;
};

export async function createPayPalOrder(params: {
  orderNumber: string;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<CreatedPayPalOrder> {
  const config = getConfig();
  const token = await getAccessToken(config);

  const response = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.orderNumber,
          custom_id: params.orderNumber,
          description: params.description.slice(0, 127),
          amount: {
            currency_code: config.currency,
            value: params.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Allure Selection",
        locale: "es-MX",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new PayPalError(
      `PayPal no pudo crear la orden de pago (${response.status}).`
    );
  }

  const data = (await response.json()) as {
    id?: string;
    links?: PayPalLink[];
  };

  const approveUrl = data.links?.find((link) => link.rel === "approve")?.href;

  if (!data.id || !approveUrl) {
    throw new PayPalError("Respuesta invalida de PayPal al crear la orden.");
  }

  return { id: data.id, approveUrl };
}

export type PayPalCaptureResult = {
  completed: boolean;
  status: string;
  captureId: string | null;
  payerEmail: string | null;
  raw: string;
};

export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<PayPalCaptureResult> {
  const config = getConfig();
  const token = await getAccessToken(config);

  const response = await fetch(
    `${config.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new PayPalError(
      `PayPal no pudo capturar el pago (${response.status}).`
    );
  }

  const data = JSON.parse(raw) as {
    status?: string;
    payer?: { email_address?: string };
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{ id?: string; status?: string }>;
      };
    }>;
  };

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const status = data.status ?? capture?.status ?? "UNKNOWN";

  return {
    completed: status === "COMPLETED",
    status,
    captureId: capture?.id ?? null,
    payerEmail: data.payer?.email_address ?? null,
    raw,
  };
}
