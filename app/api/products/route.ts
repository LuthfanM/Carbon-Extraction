import { NextResponse } from "next/server";
import { readProductsFromJson } from "@/lib/product-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await readProductsFromJson();

  return NextResponse.json({
    products,
    count: products.length,
  });
}
