import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/guard";
import { slugify, revalidateFrontend } from "@/lib/admin/utils";
import { db, requireDb } from "@/lib/db";
import { categories } from "@/drizzle/schema";

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  if (!db) {
    return NextResponse.json({ error: "数据库未配置，请设置 DATABASE_URL" }, { status: 503 });
  }

  try {
    const body = schema.parse(await request.json());
    const slug = slugify(body.slug);

    const [existing] = await requireDb()
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "该 Slug 已存在，请换一个" }, { status: 400 });
    }

    await requireDb().insert(categories).values({
      slug,
      name: body.name,
      description: body.description,
      sortOrder: body.sortOrder ?? 0,
    });
    revalidateFrontend();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整的分类信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "创建失败，请稍后重试" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  if (!db) {
    return NextResponse.json({ error: "数据库未配置" }, { status: 503 });
  }

  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
    await requireDb()
      .update(categories)
      .set({
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder,
      })
      .where(eq(categories.id, id));
    revalidateFrontend();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  if (!db) {
    return NextResponse.json({ error: "数据库未配置" }, { status: 503 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });
  await requireDb().delete(categories).where(eq(categories.id, id));
  revalidateFrontend();
  return NextResponse.json({ success: true });
}
