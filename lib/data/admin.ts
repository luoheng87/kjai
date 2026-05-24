import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  aiTools,
  articles,
  categories,
  forumComments,
  forumPosts,
  marketplaceListings,
  moderationQueue,
  sensitiveWords,
  users,
} from "@/drizzle/schema";

export async function getAdminStats() {
  if (!db) {
    return {
      pendingTools: 0,
      brokenLinks: 0,
      pendingModeration: 0,
      totalUsers: 0,
      totalTools: 0,
      totalListings: 0,
      totalPosts: 0,
      totalArticles: 0,
    };
  }

  const [
    [pendingTools],
    [brokenLinks],
    [pendingModeration],
    [totalUsers],
    [totalTools],
    [totalListings],
    [totalPosts],
    [totalArticles],
  ] = await Promise.all([
    db.select({ count: count() }).from(aiTools).where(eq(aiTools.status, "pending")),
    db.select({ count: count() }).from(aiTools).where(eq(aiTools.linkHealthy, false)),
    db.select({ count: count() }).from(moderationQueue).where(eq(moderationQueue.status, "pending")),
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(aiTools).where(eq(aiTools.status, "approved")),
    db.select({ count: count() }).from(marketplaceListings),
    db.select({ count: count() }).from(forumPosts),
    db.select({ count: count() }).from(articles),
  ]);

  return {
    pendingTools: pendingTools?.count ?? 0,
    brokenLinks: brokenLinks?.count ?? 0,
    pendingModeration: pendingModeration?.count ?? 0,
    totalUsers: totalUsers?.count ?? 0,
    totalTools: totalTools?.count ?? 0,
    totalListings: totalListings?.count ?? 0,
    totalPosts: totalPosts?.count ?? 0,
    totalArticles: totalArticles?.count ?? 0,
  };
}

export async function getCategories() {
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function getAllToolsAdmin() {
  if (!db) return [];
  return db
    .select({
      id: aiTools.id,
      name: aiTools.name,
      slug: aiTools.slug,
      tagline: aiTools.tagline,
      websiteUrl: aiTools.websiteUrl,
      status: aiTools.status,
      isFeatured: aiTools.isFeatured,
      linkHealthy: aiTools.linkHealthy,
      clickCount: aiTools.clickCount,
      likeCount: aiTools.likeCount,
      promoCode: aiTools.promoCode,
      priceRange: aiTools.priceRange,
      categoryId: aiTools.categoryId,
      categoryName: categories.name,
      createdAt: aiTools.createdAt,
    })
    .from(aiTools)
    .leftJoin(categories, eq(aiTools.categoryId, categories.id))
    .orderBy(desc(aiTools.createdAt));
}

export async function getPendingTools() {
  if (!db) return [];
  return db
    .select({
      id: aiTools.id,
      name: aiTools.name,
      slug: aiTools.slug,
      tagline: aiTools.tagline,
      websiteUrl: aiTools.websiteUrl,
      status: aiTools.status,
      createdAt: aiTools.createdAt,
      vendorName: users.name,
      vendorEmail: users.email,
    })
    .from(aiTools)
    .leftJoin(users, eq(aiTools.vendorId, users.id))
    .where(eq(aiTools.status, "pending"))
    .orderBy(desc(aiTools.createdAt));
}

export async function getApprovedToolsAdmin() {
  if (!db) return [];
  return db
    .select({
      id: aiTools.id,
      name: aiTools.name,
      websiteUrl: aiTools.websiteUrl,
      linkHealthy: aiTools.linkHealthy,
      clickCount: aiTools.clickCount,
      status: aiTools.status,
      isFeatured: aiTools.isFeatured,
    })
    .from(aiTools)
    .where(eq(aiTools.status, "approved"))
    .orderBy(desc(aiTools.clickCount));
}

export async function getMarketplaceListingsAdmin() {
  if (!db) return [];
  return db
    .select({
      id: marketplaceListings.id,
      type: marketplaceListings.type,
      title: marketplaceListings.title,
      description: marketplaceListings.description,
      budget: marketplaceListings.budget,
      status: marketplaceListings.status,
      createdAt: marketplaceListings.createdAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(marketplaceListings)
    .leftJoin(users, eq(marketplaceListings.userId, users.id))
    .orderBy(desc(marketplaceListings.createdAt));
}

export async function getForumPostsAdmin() {
  if (!db) return [];
  return db
    .select({
      id: forumPosts.id,
      title: forumPosts.title,
      content: forumPosts.content,
      tags: forumPosts.tags,
      status: forumPosts.status,
      likeCount: forumPosts.likeCount,
      commentCount: forumPosts.commentCount,
      createdAt: forumPosts.createdAt,
      authorName: users.name,
    })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.authorId, users.id))
    .orderBy(desc(forumPosts.createdAt));
}

export async function getForumCommentsAdmin() {
  if (!db) return [];
  return db
    .select({
      id: forumComments.id,
      content: forumComments.content,
      status: forumComments.status,
      createdAt: forumComments.createdAt,
      postTitle: forumPosts.title,
      authorName: users.name,
    })
    .from(forumComments)
    .leftJoin(forumPosts, eq(forumComments.postId, forumPosts.id))
    .leftJoin(users, eq(forumComments.authorId, users.id))
    .orderBy(desc(forumComments.createdAt))
    .limit(50);
}

export async function getArticlesAdmin() {
  if (!db) return [];
  return db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      isPremium: articles.isPremium,
      viewCount: articles.viewCount,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .orderBy(desc(articles.createdAt));
}

export async function getArticleById(id: string) {
  if (!db) return null;
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return row ?? null;
}

export async function getAllUsers() {
  if (!db) return [];
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      vipExpiresAt: users.vipExpiresAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function getPendingModeration() {
  if (!db) return [];
  return db
    .select()
    .from(moderationQueue)
    .where(eq(moderationQueue.status, "pending"))
    .orderBy(desc(moderationQueue.createdAt))
    .limit(50);
}

export async function getSensitiveWords() {
  if (!db) return [];
  return db.select().from(sensitiveWords).orderBy(sensitiveWords.word);
}
