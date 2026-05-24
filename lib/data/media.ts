import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { withDbFallback } from "@/lib/data/safe";
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

export async function getArticleMetaBySlug(slug: string): Promise<ArticlePreview | null> {
  if (!db) return null;
  const [row] = await db
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
  if (!row?.publishedAt) return null;
  return row;
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  if (!db) return null;

  const [row] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!row?.publishedAt) return null;

  await db
    .update(articles)
    .set({ viewCount: sql`${articles.viewCount} + 1` })
    .where(eq(articles.id, row.id));

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
