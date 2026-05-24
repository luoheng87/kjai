import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { incrementToolClick } from "@/lib/redis";
import { buildAffiliateUrl, getToolById } from "@/lib/data/tools";
import { aiTools } from "@/drizzle/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ toolId: string }> },
) {
  const { toolId } = await params;
  const { searchParams } = new URL(request.url);
  const overrideUrl = searchParams.get("url");

  let targetUrl = overrideUrl;

  if (!targetUrl) {
    const tool = await getToolById(toolId);
    if (tool) {
      targetUrl = buildAffiliateUrl(tool.websiteUrl, tool.affiliateSuffix);
    }
  }

  if (!targetUrl) {
    return NextResponse.redirect(new URL("/directory", request.url));
  }

  incrementToolClick(toolId).catch(() => {});

  try {
    await requireDb()
      .update(aiTools)
      .set({ clickCount: sql`${aiTools.clickCount} + 1` })
      .where(eq(aiTools.id, toolId));
  } catch {
    // db unavailable
  }

  return NextResponse.redirect(targetUrl);
}
