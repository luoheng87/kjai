import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireMemberApi() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "请先登录" }, { status: 401 }) };
  }
  if (!db) {
    return { error: NextResponse.json({ error: "数据库未配置，请设置 DATABASE_URL" }, { status: 503 }) };
  }
  return { session };
}
