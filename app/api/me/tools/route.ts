import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { slugify } from "@/lib/admin/utils";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberTools } from "@/lib/member/data";
import { requireDb } from "@/lib/db";
import { aiTools } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  websiteUrl: z.string().url(),
  categoryId: z.string().uuid().optional().nullable(),
  affiliateSuffix: z.string().optional(),
  promoCode: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const tools = await getMemberTools(guard.session!.user.id);
  return NextResponse.json(tools);
}

export async function POST(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());
    const slug = slugify(body.name);

    const [existing] = await requireDb()
      .select({ id: aiTools.id })
      .from(aiTools)
      .where(eq(aiTools.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "同名工具已存在，请修改名称" }, { status: 400 });
    }

    const [tool] = await requireDb()
      .insert(aiTools)
      .values({
        vendorId: guard.session!.user.id,
        categoryId: body.categoryId || null,
        name: body.name,
        slug,
        tagline: body.tagline,
        websiteUrl: body.websiteUrl,
        affiliateSuffix: body.affiliateSuffix,
        promoCode: body.promoCode,
        description: body.description,
        status: "pending",
      })
      .returning({ id: aiTools.id });

    return NextResponse.json({
      success: true,
      id: tool.id,
      message: "工具已提交，审核通过后将上架",
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
    .delete(aiTools)
    .where(
      and(
        eq(aiTools.id, id),
        eq(aiTools.vendorId, guard.session!.user.id),
        eq(aiTools.status, "pending"),
      ),
    );

  return NextResponse.json({ success: true });
}
