import { type NextRequest, NextResponse } from "next/server";

import { getProductsList } from "@/services/catalog.service";
import type { ProductListParams } from "@/types/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getOptionalParam(request: NextRequest, key: string) {
  const value = request.nextUrl.searchParams.get(key)?.trim();
  return value ? value.slice(0, 80) : undefined;
}

function getLimit(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsed = rawLimit ? Number(rawLimit) : undefined;
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const params: ProductListParams = {
      category: getOptionalParam(request, "category"),
      collection: getOptionalParam(request, "collection"),
      audience: getOptionalParam(request, "audience"),
      q: getOptionalParam(request, "q"),
      limit: getLimit(request),
    };

    const products = await getProductsList(params);

    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la informacion publica." },
      { status: 500 }
    );
  }
}
