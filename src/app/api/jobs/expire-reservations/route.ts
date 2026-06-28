import { NextResponse, type NextRequest } from "next/server";

import { expireStaleReservations } from "@/repositories/order.repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Expira reservas de stock vencidas. Pensado para ejecutarse por un cron
 * (p.ej. cada minuto). Si CRON_SECRET esta definido, se exige en el header
 * Authorization: Bearer <secret> o ?secret=<secret>.
 */
async function handle(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided =
      request.headers.get("authorization")?.replace("Bearer ", "") ??
      request.nextUrl.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  try {
    const expiredOrders = await expireStaleReservations();
    return NextResponse.json({ data: { expiredOrders } });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron expirar las reservas." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
