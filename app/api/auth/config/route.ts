import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/auth-config";

export function GET() {
  return NextResponse.json({
    dbConfigured: isDbConfigured(),
    devMode: !isDbConfigured(),
  });
}
