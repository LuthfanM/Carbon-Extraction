import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "low-carbon-materials-hub",
    timestamp: new Date().toISOString(),
  });
}
