import { NextResponse, type NextRequest } from "next/server";

import { cancelPayment } from "@/services/payment.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cancel URL de PayPal. Libera el stock reservado, recrea el carrito del
 * cliente y lo regresa al carrito.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const orderNumber = request.nextUrl.searchParams.get("order");

  if (orderNumber) {
    try {
      await cancelPayment(orderNumber);
    } catch {
      // Si falla la cancelacion, igual regresamos al carrito.
    }
  }

  return NextResponse.redirect(new URL("/carrito?pago=cancelado", origin));
}
