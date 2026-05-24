import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/guard";
import { slugify, revalidateFrontend } from "@/lib/admin/utils";
import { requireDb } from "@/lib/db";
import { articles } from "@/drizzle/schema";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  isPremium: z.boolean().optional(),
  coverUrl: z.string().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());
    await requireDb().insert(articles).values({
      title: body.title,
      slug: body.slug ? slugify(body.slug) : slugify(body.title),
      excerpt: body.excerpt,
      content: body.content,
      isPremium: body.isPremium ?? false,
      coverUrl: body.coverUrl,
      publishedAt: new Date(),
    });
    revalidateFrontend();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

    const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (typeof data.publishedAt === "string") {
      updates.publishedAt = new Date(data.publishedAt);
    }

    await requireDb()
      .update(articles)
      .set(updates)
      .where(eq(articles.id, id));
    revalidateFrontend();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  await requireDb().delete(articles).where(eq(articles.id, id));
  revalidateFrontend();
  return NextResponse.json({ success: true });
}
