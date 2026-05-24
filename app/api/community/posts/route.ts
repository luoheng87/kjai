import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moderateContent } from "@/lib/moderation";
import { requireDb } from "@/lib/db";
import { forumPosts } from "@/drizzle/schema";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "数据库未配置" }, { status: 503 });
  }

  try {
    const body = schema.parse(await request.json());
    const fullText = `${body.title} ${body.content}`;
    const mod = await moderateContent("forum_post", "new", fullText);

    const status = mod.allowed ? "published" : "hidden";

    const [post] = await requireDb()
      .insert(forumPosts)
      .values({
        authorId: session.user.id,
        title: body.title,
        content: body.content,
        tags: body.tags,
        status,
      })
      .returning({ id: forumPosts.id });

    if (!mod.allowed) {
      return NextResponse.json({
        success: true,
        id: post.id,
        message: "帖子含敏感词，已进入人工审核",
      });
    }

    return NextResponse.json({ success: true, id: post.id });
  } catch {
    return NextResponse.json({ error: "发布失败" }, { status: 400 });
  }
}
