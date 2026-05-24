import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberPosts } from "@/lib/member/data";
import { moderateContent } from "@/lib/moderation";
import { requireDb } from "@/lib/db";
import { forumPosts } from "@/drizzle/schema";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const posts = await getMemberPosts(guard.session!.user.id);
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());
    const fullText = `${body.title} ${body.content}`;
    const mod = await moderateContent("forum_post", "new", fullText);
    const status = mod.allowed ? "published" : "hidden";

    const [post] = await requireDb()
      .insert(forumPosts)
      .values({
        authorId: guard.session!.user.id,
        title: body.title,
        content: body.content,
        tags: body.tags,
        status,
      })
      .returning({ id: forumPosts.id });

    return NextResponse.json({
      success: true,
      id: post.id,
      message: mod.allowed ? undefined : "帖子含敏感词，已进入人工审核",
    });
  } catch {
    return NextResponse.json({ error: "发布失败" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  await requireDb()
    .delete(forumPosts)
    .where(
      and(
        eq(forumPosts.id, id),
        eq(forumPosts.authorId, guard.session!.user.id),
      ),
    );

  return NextResponse.json({ success: true });
}
