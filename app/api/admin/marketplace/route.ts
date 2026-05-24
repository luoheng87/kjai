import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/guard";
import { revalidateFrontend } from "@/lib/admin/utils";
import { requireDb } from "@/lib/db";
import { marketplaceListings } from "@/drizzle/schema";

export async function PATCH(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  await requireDb()
    .update(marketplaceListings)
    .set({ status, updatedAt: new Date() })
    .where(eq(marketplaceListings.id, id));

  revalidateFrontend();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if ("error" in guard && guard.error) return guard.error;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "缺少 ID" }, { status: 400 });

  await requireDb().delete(marketplaceListings).where(eq(marketplaceListings.id, id));
  revalidateFrontend();
  return NextResponse.json({ success: true });
}
