import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { requireDb } from "@/lib/db";
import { aiTools } from "@/drizzle/schema";

const toolSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  websiteUrl: z.string().url(),
  affiliateSuffix: z.string().optional(),
  promoCode: z.string().optional(),
  description: z.string().optional(),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `tool-${Date.now()}`;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (session.user.role !== "vendor" && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const form = await request.formData();
  const parsed = toolSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/vendor?error=invalid", request.url));
  }

  if (process.env.DATABASE_URL) {
    await requireDb().insert(aiTools).values({
      vendorId: session.user.id,
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      tagline: parsed.data.tagline,
      websiteUrl: parsed.data.websiteUrl,
      affiliateSuffix: parsed.data.affiliateSuffix,
      promoCode: parsed.data.promoCode,
      description: parsed.data.description,
      status: "pending",
    });
  }

  return NextResponse.redirect(new URL("/vendor?success=1", request.url));
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { toolId, action } = await request.json();
  if (!toolId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    await requireDb()
      .update(aiTools)
      .set({ status: action === "approve" ? "approved" : "rejected" })
      .where(eq(aiTools.id, toolId));
  }

  revalidatePath("/directory");
  revalidatePath("/hub");

  return NextResponse.json({ success: true });
}
