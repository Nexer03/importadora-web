import { paypalProvider } from "./paypal.provider";
import { stripeProvider } from "./stripe.provider";
import { PaymentError, type PaymentProvider } from "./provider";

/**
 * Registro de proveedores de pago disponibles. Para agregar otro proveedor:
 * crear su `*.provider.ts` implementando PaymentProvider y registrarlo aqui.
 */
const providers: Record<string, PaymentProvider> = {
  paypal: paypalProvider,
  stripe: stripeProvider,
};

export type PaymentMethodOption = {
  provider: string;
  label: string;
};

/**
 * Metodos de pago disponibles segun las credenciales configuradas en el
 * entorno. Solo se muestran en el checkout los que tienen credenciales.
 */
export function getAvailablePaymentMethods(): PaymentMethodOption[] {
  const methods: PaymentMethodOption[] = [];
  if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
    methods.push({ provider: "paypal", label: "PayPal" });
  }
  if (process.env.STRIPE_SECRET_KEY) {
    methods.push({ provider: "stripe", label: "Tarjeta (Stripe)" });
  }
  return methods;
}

export function isPaymentMethodAvailable(provider: string): boolean {
  return getAvailablePaymentMethods().some(
    (method) => method.provider === provider
  );
}

export function getPaymentProvider(name: string): PaymentProvider {
  const provider = providers[name];
  if (!provider) {
    throw new PaymentError(`Proveedor de pago no soportado: ${name}`);
  }
  return provider;
}

/**
 * Proveedor por defecto para nuevos pagos. Configurable con PAYMENT_PROVIDER.
 */
export function getDefaultPaymentProvider(): PaymentProvider {
  return getPaymentProvider(process.env.PAYMENT_PROVIDER ?? "paypal");
}

/** Moneda de la tienda para registrar montos de pago. */
export function getStoreCurrency(): string {
  return process.env.PAYMENT_CURRENCY ?? process.env.PAYPAL_CURRENCY ?? "MXN";
}
