import { NextResponse } from "next/server";

import { getCatalogFilters } from "@/services/catalog.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { categories } = await getCatalogFilters();
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la informacion publica." },
      { status: 500 }
    );
  }
}
