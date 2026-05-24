import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { aiTools } from "@/drizzle/schema";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const database = requireDb();
  const tools = await database
    .select({ id: aiTools.id, websiteUrl: aiTools.websiteUrl })
    .from(aiTools)
    .where(eq(aiTools.status, "approved"));

  let broken = 0;
  for (const tool of tools.slice(0, 50)) {
    const healthy = await checkUrl(tool.websiteUrl);
    if (!healthy) {
      broken++;
      await database
        .update(aiTools)
        .set({ linkHealthy: false, lastLinkCheckAt: new Date() })
        .where(eq(aiTools.id, tool.id));
    } else {
      await database
        .update(aiTools)
        .set({ linkHealthy: true, lastLinkCheckAt: new Date() })
        .where(eq(aiTools.id, tool.id));
    }
  }

  return NextResponse.json({ checked: tools.length, broken });
}
