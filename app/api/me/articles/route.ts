import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { slugify, revalidateFrontend } from "@/lib/admin/utils";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberArticles } from "@/lib/member/data";
import { moderateContent } from "@/lib/moderation";
import { requireDb } from "@/lib/db";
import { articles } from "@/drizzle/schema";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverUrl: z.string().optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const items = await getMemberArticles(guard.session!.user.id);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());
    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const fullText = `${body.title} ${body.content}`;
    const mod = await moderateContent("article", "new", fullText);

    const [existing] = await requireDb()
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Slug 已存在，请换一个" }, { status: 400 });
    }

    const [article] = await requireDb()
      .insert(articles)
      .values({
        authorId: guard.session!.user.id,
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        coverUrl: body.coverUrl,
        isPremium: false,
        publishedAt: null,
      })
      .returning({ id: articles.id, slug: articles.slug });

    return NextResponse.json({
      success: true,
      id: article.id,
      slug: article.slug,
      message: mod.allowed
        ? "资讯已提交，审核通过后将公开展示"
        : "内容含敏感词，已进入人工审核",
    });
  } catch {
    return NextResponse.json({ error: "提交失败" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  await requireDb()
    .delete(articles)
    .where(
      and(
        eq(articles.id, id),
        eq(articles.authorId, guard.session!.user.id),
      ),
    );

  revalidateFrontend();
  return NextResponse.json({ success: true });
}
