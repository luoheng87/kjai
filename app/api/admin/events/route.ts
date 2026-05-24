import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { revalidateFrontend } from "@/lib/admin/utils";
import { requireDb } from "@/lib/db";
import { events } from "@/drizzle/schema";

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id, action } = await request.json();
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  await requireDb()
    .update(events)
    .set({
      status: action === "approve" ? "published" : "rejected",
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));

  revalidateFrontend();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  await requireDb().delete(events).where(eq(events.id, id));
  revalidateFrontend();
  return NextResponse.json({ success: true });
}
