import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { slugify, revalidateFrontend } from "@/lib/admin/utils";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberEvents } from "@/lib/member/data";
import { moderateContent } from "@/lib/moderation";
import { requireDb } from "@/lib/db";
import { events } from "@/drizzle/schema";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  location: z.string().optional(),
  coverUrl: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  externalTicketUrl: z.string().url().optional().or(z.literal("")),
  useInternalForm: z.boolean().optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const items = await getMemberEvents(guard.session!.user.id);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = schema.parse(await request.json());
    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const mod = await moderateContent("event", "new", `${body.title} ${body.description}`);

    const [existing] = await requireDb()
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Slug 已存在，请换一个" }, { status: 400 });
    }

    const [event] = await requireDb()
      .insert(events)
      .values({
        organizerId: guard.session!.user.id,
        title: body.title,
        slug,
        description: body.description,
        location: body.location,
        coverUrl: body.coverUrl,
        startsAt: new Date(body.startsAt),
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        externalTicketUrl: body.externalTicketUrl || null,
        useInternalForm: body.useInternalForm ?? false,
        status: "pending",
      })
      .returning({ id: events.id, slug: events.slug });

    revalidateFrontend();

    return NextResponse.json({
      success: true,
      id: event.id,
      slug: event.slug,
      message: mod.allowed
        ? "活动已提交，审核通过后将公开展示"
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
    .delete(events)
    .where(
      and(
        eq(events.id, id),
        eq(events.organizerId, guard.session!.user.id),
        eq(events.status, "pending"),
      ),
    );

  revalidateFrontend();
  return NextResponse.json({ success: true });
}
