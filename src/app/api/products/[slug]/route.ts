import { type NextRequest, NextResponse } from "next/server";

import { getProductDetail } from "@/services/catalog.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductDetail(slug);

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la informacion publica." },
      { status: 500 }
    );
  }
}
