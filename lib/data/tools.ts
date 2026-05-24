import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { withDbFallback } from "@/lib/data/safe";
import { aiTools, categories } from "@/drizzle/schema";
import type { AiToolDetail, AiToolPreview } from "@/lib/data/types";

function mapTool(
  tool: typeof aiTools.$inferSelect,
  category?: typeof categories.$inferSelect | null,
): AiToolPreview {
  return {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline,
    logoUrl: tool.logoUrl,
    categorySlug: category?.slug ?? null,
    categoryName: category?.name ?? null,
    rating: tool.rating,
    clickCount: tool.clickCount,
    likeCount: tool.likeCount,
    websiteUrl: tool.websiteUrl,
    affiliateSuffix: tool.affiliateSuffix,
    promoCode: tool.promoCode,
    isFeatured: tool.isFeatured,
  };
}

export async function getApprovedTools(categorySlug?: string): Promise<AiToolPreview[]> {
  if (!db) return [];

  const rows = await withDbFallback(
    () =>
      db!
        .select({ tool: aiTools, category: categories })
        .from(aiTools)
        .leftJoin(categories, eq(aiTools.categoryId, categories.id))
        .where(eq(aiTools.status, "approved"))
        .orderBy(desc(aiTools.clickCount)),
    [],
    "getApprovedTools",
  );

  const mapped = rows.map(({ tool, category }) => mapTool(tool, category));
  if (categorySlug) {
    return mapped.filter((t) => t.categorySlug === categorySlug);
  }
  return mapped;
}

export async function getHotTools(limit = 5): Promise<AiToolPreview[]> {
  const tools = await getApprovedTools();
  return [...tools]
    .sort((a, b) => b.clickCount + b.likeCount * 2 - (a.clickCount + a.likeCount * 2))
    .slice(0, limit);
}

export async function getToolBySlug(slug: string): Promise<AiToolDetail | null> {
  if (!db) return null;

  const row = await withDbFallback(
    async () => {
      const [result] = await db!!
        .select({ tool: aiTools, category: categories })
        .from(aiTools)
        .leftJoin(categories, eq(aiTools.categoryId, categories.id))
        .where(eq(aiTools.slug, slug))
        .limit(1);
      return result ?? null;
    },
    null,
    "getToolBySlug",
  );

  if (!row || row.tool.status !== "approved") return null;

  return {
    ...mapTool(row.tool, row.category),
    description: row.tool.description,
    content: row.tool.content,
    priceRange: row.tool.priceRange,
  };
}

export async function getToolById(id: string): Promise<AiToolPreview | null> {
  if (!db) return null;

  const row = await withDbFallback(
    async () => {
      const [result] = await db!
        .select({ tool: aiTools, category: categories })
        .from(aiTools)
        .leftJoin(categories, eq(aiTools.categoryId, categories.id))
        .where(eq(aiTools.id, id))
        .limit(1);
      return result ?? null;
    },
    null,
    "getToolById",
  );

  if (!row || row.tool.status !== "approved") return null;
  return mapTool(row.tool, row.category);
}

export function buildAffiliateUrl(websiteUrl: string, suffix?: string | null) {
  if (!suffix) return websiteUrl;
  const separator = websiteUrl.includes("?") ? "&" : "?";
  const cleanSuffix = suffix.startsWith("?") || suffix.startsWith("&")
    ? suffix.slice(1)
    : suffix;
  return `${websiteUrl}${separator}${cleanSuffix}`;
}
