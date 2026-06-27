import { NextResponse, type NextRequest } from "next/server";

import { confirmPayment } from "@/services/payment.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * success_url de Stripe Checkout. Confirma el pago recuperando la sesion en
 * backend (no se confia en el cliente) y redirige segun el resultado.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const orderNumber = request.nextUrl.searchParams.get("order");

  if (!orderNumber) {
    return NextResponse.redirect(new URL("/carrito", origin));
  }

  try {
    const { result } = await confirmPayment(orderNumber);

    if (result === "not_found") {
      return NextResponse.redirect(new URL("/carrito", origin));
    }

    if (result === "failed" || result === "invalid") {
      return NextResponse.redirect(
        new URL(`/pedido/${orderNumber}?pago=fallido`, origin)
      );
    }

    return NextResponse.redirect(new URL(`/pedido/${orderNumber}`, origin));
  } catch {
    return NextResponse.redirect(
      new URL(`/pedido/${orderNumber}?pago=error`, origin)
    );
  }
}
