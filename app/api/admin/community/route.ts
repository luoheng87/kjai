import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { revalidateFrontend } from "@/lib/admin/utils";
import { requireDb } from "@/lib/db";
import { forumComments, forumPosts } from "@/drizzle/schema";

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { type, id, status } = await request.json();
  if (!type || !id || !status) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  if (type === "post") {
    await requireDb().update(forumPosts).set({ status }).where(eq(forumPosts.id, id));
  } else if (type === "comment") {
    await requireDb().update(forumComments).set({ status }).where(eq(forumComments.id, id));
  } else {
    return NextResponse.json({ error: "未知类型" }, { status: 400 });
  }

  revalidateFrontend();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { type, id } = await request.json();
  if (!type || !id) return NextResponse.json({ error: "参数错误" }, { status: 400 });

  if (type === "post") {
    await requireDb().delete(forumPosts).where(eq(forumPosts.id, id));
  } else if (type === "comment") {
    await requireDb().delete(forumComments).where(eq(forumComments.id, id));
  }

  revalidateFrontend();
  return NextResponse.json({ success: true });
}
