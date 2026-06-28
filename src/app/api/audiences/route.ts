import { NextResponse } from "next/server";

import { getCatalogFilters } from "@/services/catalog.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { audiences } = await getCatalogFilters();
    return NextResponse.json({ data: audiences });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la informacion publica." },
      { status: 500 }
    );
  }
}
