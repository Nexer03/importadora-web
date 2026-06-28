import { NextResponse, type NextRequest } from "next/server";

import {
  addToCart,
  CartError,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function handleError(error: unknown) {
  if (error instanceof CartError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { error: "No se pudo procesar el carrito." },
    { status: 400 }
  );
}

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json({ data: cart });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar el carrito." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    const cart = await addToCart(body);
    return NextResponse.json({ data: cart });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await readBody(request);
    const cart = await updateCartItem(body);
    return NextResponse.json({ data: cart });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await readBody(request);
    const cart = await removeCartItem(body);
    return NextResponse.json({ data: cart });
  } catch (error) {
    return handleError(error);
  }
}
