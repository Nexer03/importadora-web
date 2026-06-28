"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import {
  CheckoutError,
  createOrderFromCart,
} from "@/services/checkout.service";

export type CheckoutFormState = {
  error?: string;
};

function firstZodMessage(error: ZodError): string {
  return error.issues[0]?.message ?? "Datos invalidos.";
}

export async function submitCheckoutAction(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  let approveUrl: string;

  try {
    const result = await createOrderFromCart({
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      deliveryMethod: formData.get("deliveryMethod"),
      paymentProvider: formData.get("paymentProvider"),
      shippingAddress: formData.get("shippingAddress") ?? "",
      postalCode: formData.get("postalCode") ?? "",
      city: formData.get("city") ?? "",
      state: formData.get("state") ?? "",
      addressReference: formData.get("addressReference") ?? "",
    });
    approveUrl = result.approveUrl;
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { error: error.message };
    }
    if (error instanceof ZodError) {
      return { error: firstZodMessage(error) };
    }
    return { error: "No se pudo crear el pedido. Intenta de nuevo." };
  }

  // El carrito ya quedo convertido; refrescamos el contador del header.
  revalidatePath("/", "layout");
  // Redirige al cliente a PayPal para aprobar el pago.
  redirect(approveUrl);
}
