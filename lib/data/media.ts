import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { withDbFallback } from "@/lib/data/safe";
import { normalizeArticleSlug } from "@/lib/utils";
import { articles } from "@/drizzle/schema";
import type { ArticleDetail, ArticlePreview } from "@/lib/data/types";

export async function getPublishedArticles(limit?: number): Promise<ArticlePreview[]> {
  if (!db) return [];

  const rows = await withDbFallback(
    () =>
      db!
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          excerpt: articles.excerpt,
          isPremium: articles.isPremium,
          publishedAt: articles.publishedAt,
        })
        .from(articles)
        .where(isNotNull(articles.publishedAt))
        .orderBy(desc(articles.publishedAt)),
    [],
    "getPublishedArticles",
  );

  return limit ? rows.slice(0, limit) : rows;
}

export async function getArticleMetaBySlug(rawSlug: string): Promise<ArticlePreview | null> {
  if (!db) return null;
  const slug = normalizeArticleSlug(rawSlug);

  const row = await withDbFallback(
    async () => {
      const [result] = await db!
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          excerpt: articles.excerpt,
          isPremium: articles.isPremium,
          publishedAt: articles.publishedAt,
        })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);
      return result ?? null;
    },
    null,
    "getArticleMetaBySlug",
  );

  if (!row?.publishedAt) return null;
  return row;
}

export async function getArticleBySlug(rawSlug: string): Promise<ArticleDetail | null> {
  if (!db) return null;
  const slug = normalizeArticleSlug(rawSlug);

  const row = await withDbFallback(
    async () => {
      const [result] = await db!
        .select()
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);
      return result ?? null;
    },
    null,
    "getArticleBySlug",
  );

  if (!row?.publishedAt) return null;

  try {
    await db!
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, row.id));
  } catch (error) {
    console.error("[db] article viewCount update failed:", error);
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverUrl: row.coverUrl,
    isPremium: row.isPremium,
    publishedAt: row.publishedAt,
    viewCount: row.viewCount + 1,
  };
}
