import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "无权限" }, { status: 403 }) };
  }
  return { session };
}
