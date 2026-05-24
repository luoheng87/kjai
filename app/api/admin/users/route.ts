import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { requireDb } from "@/lib/db";
import { users } from "@/drizzle/schema";

const updateSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "vip", "vendor", "admin"]),
  vipExpiresAt: z.string().datetime().optional(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, role, vipExpiresAt } = updateSchema.parse(body);

    if (userId === session.user.id && role !== "admin") {
      return NextResponse.json({ error: "不能降低自己的管理员权限" }, { status: 400 });
    }

    await requireDb()
      .update(users)
      .set({
        role,
        vipExpiresAt: role === "vip" && vipExpiresAt ? new Date(vipExpiresAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
