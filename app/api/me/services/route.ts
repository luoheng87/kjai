import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberListings } from "@/lib/member/data";
import { requireDb } from "@/lib/db";
import { marketplaceListings } from "@/drizzle/schema";

const schema = z.object({
  type: z.enum(["demand", "service"]),
  title: z.string().min(1),
  description: z.string().min(1),
  budget: z.string().optional(),
  deliveryTime: z.string().optional(),
  contactWechat: z.string().optional(),
  contactWhatsapp: z.string().optional(),
  contactTelegram: z.string().optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const listings = await getMemberListings(guard.session!.user.id);
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());

    const [listing] = await requireDb()
      .insert(marketplaceListings)
      .values({
        userId: guard.session!.user.id,
        type: body.type,
        title: body.title,
        description: body.description,
        budget: body.budget,
        deliveryTime: body.deliveryTime,
        contactWechat: body.contactWechat,
        contactWhatsapp: body.contactWhatsapp,
        contactTelegram: body.contactTelegram,
        status: "pending",
      })
      .returning({ id: marketplaceListings.id });

    return NextResponse.json({
      success: true,
      id: listing.id,
      message: "服务已提交，审核通过后将展示在市场",
    });
  } catch {
    return NextResponse.json({ error: "发布失败" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id, action } = await request.json();
  if (!id || !["archive", "activate"].includes(action)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  await requireDb()
    .update(marketplaceListings)
    .set({
      status: action === "archive" ? "archived" : "pending",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(marketplaceListings.id, id),
        eq(marketplaceListings.userId, guard.session!.user.id),
      ),
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  await requireDb()
    .delete(marketplaceListings)
    .where(
      and(
        eq(marketplaceListings.id, id),
        eq(marketplaceListings.userId, guard.session!.user.id),
      ),
    );

  return NextResponse.json({ success: true });
}
