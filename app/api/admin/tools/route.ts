import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/guard";
import { slugify, revalidateFrontend } from "@/lib/admin/utils";
import { requireDb } from "@/lib/db";
import { aiTools } from "@/drizzle/schema";

const createSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  websiteUrl: z.string().url(),
  categoryId: z.string().uuid().optional().nullable(),
  affiliateSuffix: z.string().optional(),
  promoCode: z.string().optional(),
  priceRange: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = createSchema.parse(await request.json());
    await requireDb().insert(aiTools).values({
      name: body.name,
      slug: slugify(body.name),
      tagline: body.tagline,
      websiteUrl: body.websiteUrl,
      categoryId: body.categoryId || null,
      affiliateSuffix: body.affiliateSuffix,
      promoCode: body.promoCode,
      priceRange: body.priceRange,
      description: body.description,
      content: body.content,
      isFeatured: body.isFeatured ?? false,
      status: body.status ?? "approved",
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
    const body = await request.json();
    const { id, action, ...data } = body;
    if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

    if (action === "approve" || action === "reject") {
      await requireDb()
        .update(aiTools)
        .set({ status: action === "approve" ? "approved" : "rejected", updatedAt: new Date() })
        .where(eq(aiTools.id, id));
    } else {
      const update: Record<string, unknown> = { updatedAt: new Date() };
      if (data.isFeatured !== undefined) update.isFeatured = data.isFeatured;
      if (data.categoryId !== undefined) update.categoryId = data.categoryId || null;
      if (data.status) update.status = data.status;
      if (data.promoCode !== undefined) update.promoCode = data.promoCode;
      if (data.priceRange !== undefined) update.priceRange = data.priceRange;
      if (data.linkHealthy !== undefined) update.linkHealthy = data.linkHealthy;
      await requireDb().update(aiTools).set(update).where(eq(aiTools.id, id));
    }

    revalidateFrontend();
    revalidatePath("/admin");
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
  await requireDb().delete(aiTools).where(eq(aiTools.id, id));
  revalidateFrontend();
  return NextResponse.json({ success: true });
}
