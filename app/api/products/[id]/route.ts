import { NextResponse } from "next/server";
import { readProductFromJson } from "@/lib/product-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await readProductFromJson(id);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ product });
}
