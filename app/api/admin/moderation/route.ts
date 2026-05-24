import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { requireDb } from "@/lib/db";
import { moderationQueue, sensitiveWords } from "@/drizzle/schema";

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { word } = await request.json();
  if (!word?.trim()) {
    return NextResponse.json({ error: "敏感词不能为空" }, { status: 400 });
  }

  try {
    await requireDb().insert(sensitiveWords).values({ word: word.trim() });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "添加失败，可能已存在" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id, action } = await request.json();
  if (!id || !action) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  await requireDb()
    .update(moderationQueue)
    .set({ status: action === "approve" ? "approved" : "rejected" })
    .where(eq(moderationQueue.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id, type } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  if (type === "word") {
    await requireDb().delete(sensitiveWords).where(eq(sensitiveWords.id, id));
  } else {
    await requireDb().delete(moderationQueue).where(eq(moderationQueue.id, id));
  }

  return NextResponse.json({ success: true });
}
