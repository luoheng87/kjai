import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  aiTools,
  articles,
  events,
  forumPosts,
  marketplaceListings,
  users,
} from "@/drizzle/schema";

export async function getMemberProfile(userId: string) {
  if (!db) return null;
  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      bio: users.bio,
      role: users.role,
      vipExpiresAt: users.vipExpiresAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row ?? null;
}

export async function getMemberStats(userId: string) {
  if (!db) {
    return { posts: 0, articles: 0, tools: 0, services: 0, events: 0 };
  }

  const [posts, articlesList, tools, services, eventsList] = await Promise.all([
    db.select({ id: forumPosts.id }).from(forumPosts).where(eq(forumPosts.authorId, userId)),
    db.select({ id: articles.id }).from(articles).where(eq(articles.authorId, userId)),
    db.select({ id: aiTools.id }).from(aiTools).where(eq(aiTools.vendorId, userId)),
    db
      .select({ id: marketplaceListings.id })
      .from(marketplaceListings)
      .where(eq(marketplaceListings.userId, userId)),
    db.select({ id: events.id }).from(events).where(eq(events.organizerId, userId)),
  ]);

  return {
    posts: posts.length,
    articles: articlesList.length,
    tools: tools.length,
    services: services.length,
    events: eventsList.length,
  };
}

export async function getMemberPosts(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: forumPosts.id,
      title: forumPosts.title,
      status: forumPosts.status,
      commentCount: forumPosts.commentCount,
      createdAt: forumPosts.createdAt,
    })
    .from(forumPosts)
    .where(eq(forumPosts.authorId, userId))
    .orderBy(desc(forumPosts.createdAt));
}

export async function getMemberArticles(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(eq(articles.authorId, userId))
    .orderBy(desc(articles.createdAt));
}

export async function getMemberTools(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: aiTools.id,
      name: aiTools.name,
      status: aiTools.status,
      createdAt: aiTools.createdAt,
    })
    .from(aiTools)
    .where(eq(aiTools.vendorId, userId))
    .orderBy(desc(aiTools.createdAt));
}

export async function getMemberListings(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: marketplaceListings.id,
      type: marketplaceListings.type,
      title: marketplaceListings.title,
      status: marketplaceListings.status,
      createdAt: marketplaceListings.createdAt,
    })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.userId, userId))
    .orderBy(desc(marketplaceListings.createdAt));
}

export async function getMemberEvents(userId: string) {
  if (!db) return [];
  return db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      location: events.location,
      startsAt: events.startsAt,
      status: events.status,
      createdAt: events.createdAt,
    })
    .from(events)
    .where(eq(events.organizerId, userId))
    .orderBy(desc(events.createdAt));
}
