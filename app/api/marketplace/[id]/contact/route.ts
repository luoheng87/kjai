import { NextResponse } from "next/server";
import { and, count, eq, gte } from "drizzle-orm";
import { auth, isVip } from "@/lib/auth";
import { FREE_CONTACT_VIEWS_PER_DAY } from "@/lib/constants";
import { getListingById } from "@/lib/data/marketplace";
import { db, requireDb } from "@/lib/db";
import { contactViews } from "@/drizzle/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const listing = await getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "不存在" }, { status: 404 });
  }

  const vip = isVip(session.user.role, null);

  if (!vip && db) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayViews] = await db
      .select({ count: count() })
      .from(contactViews)
      .where(
        and(
          eq(contactViews.userId, session.user.id),
          gte(contactViews.viewedAt, todayStart),
        ),
      );

    const alreadyViewed = await db
      .select()
      .from(contactViews)
      .where(
        and(
          eq(contactViews.userId, session.user.id),
          eq(contactViews.listingId, id),
        ),
      )
      .limit(1);

    if (!alreadyViewed.length && (todayViews?.count ?? 0) >= FREE_CONTACT_VIEWS_PER_DAY) {
      return NextResponse.json(
        { error: "今日免费查看次数已用完，请升级 VIP" },
        { status: 403 },
      );
    }

    if (!alreadyViewed.length) {
      await requireDb().insert(contactViews).values({
        userId: session.user.id,
        listingId: id,
      });
    }
  }

  return NextResponse.json({
    contactWechat: listing.contactWechat,
    contactWhatsapp: listing.contactWhatsapp,
    contactTelegram: listing.contactTelegram,
  });
}
