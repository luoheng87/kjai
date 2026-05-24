import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { forumComments, forumPosts, users } from "@/drizzle/schema";
import type { ForumPostDetail, ForumPostPreview } from "@/lib/data/types";

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function getPublishedPosts(): Promise<ForumPostPreview[]> {
  if (!db) return [];

  const rows = await db
    .select({
      id: forumPosts.id,
      title: forumPosts.title,
      content: forumPosts.content,
      tags: forumPosts.tags,
      likeCount: forumPosts.likeCount,
      commentCount: forumPosts.commentCount,
      createdAt: forumPosts.createdAt,
      authorName: users.name,
    })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.authorId, users.id))
    .where(eq(forumPosts.status, "published"))
    .orderBy(desc(forumPosts.createdAt));

  return rows.map((row) => ({
    ...row,
    tags: parseTags(row.tags),
  }));
}

export async function getPostById(id: string): Promise<ForumPostDetail | null> {
  if (!db) return null;

  const [post] = await db
    .select({
      id: forumPosts.id,
      title: forumPosts.title,
      content: forumPosts.content,
      tags: forumPosts.tags,
      likeCount: forumPosts.likeCount,
      commentCount: forumPosts.commentCount,
      createdAt: forumPosts.createdAt,
      authorName: users.name,
      status: forumPosts.status,
    })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.authorId, users.id))
    .where(eq(forumPosts.id, id))
    .limit(1);

  if (!post || post.status !== "published") return null;

  const comments = await db
    .select({
      id: forumComments.id,
      content: forumComments.content,
      createdAt: forumComments.createdAt,
      authorName: users.name,
    })
    .from(forumComments)
    .leftJoin(users, eq(forumComments.authorId, users.id))
    .where(
      and(
        eq(forumComments.postId, id),
        eq(forumComments.status, "published"),
      ),
    )
    .orderBy(forumComments.createdAt);

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    tags: parseTags(post.tags),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    authorName: post.authorName,
    createdAt: post.createdAt,
    comments,
  };
}
