import { NextResponse } from "next/server";

import { getHomePageData } from "@/services/home.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getHomePageData();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la informacion publica." },
      { status: 500 }
    );
  }
}
