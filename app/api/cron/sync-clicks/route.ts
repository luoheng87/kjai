import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { getRedis } from "@/lib/redis";
import { aiTools } from "@/drizzle/schema";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis || !process.env.DATABASE_URL) {
    return NextResponse.json({ synced: 0, message: "Redis or DB not configured" });
  }

  const keys = await redis.keys("tool:clicks:*");
  let synced = 0;

  for (const key of keys) {
    if (key.endsWith("pending-sync")) continue;
    const toolId = key.replace("tool:clicks:", "");
    const clicks = await redis.get<number>(key);
    if (!clicks || clicks <= 0) continue;

    await requireDb()
      .update(aiTools)
      .set({ clickCount: sql`${aiTools.clickCount} + ${clicks}` })
      .where(eq(aiTools.id, toolId));

    await redis.del(key);
    synced++;
  }

  await redis.set("tool:clicks:pending-sync", 0);

  return NextResponse.json({ synced });
}
