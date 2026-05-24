import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { requireDb } from "@/lib/db";
import { marketplaceListings } from "@/drizzle/schema";

const listingSchema = z.object({
  type: z.enum(["demand", "service"]),
  title: z.string().min(1),
  description: z.string().min(1),
  budget: z.string().optional(),
  deliveryTime: z.string().optional(),
  contactWechat: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = listingSchema.parse(body);

    if (process.env.DATABASE_URL) {
      await requireDb().insert(marketplaceListings).values({
        userId: session.user.id,
        type: data.type,
        title: data.title,
        description: data.description,
        budget: data.budget,
        deliveryTime: data.deliveryTime,
        contactWechat: data.contactWechat,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "发布失败" }, { status: 400 });
  }
}
