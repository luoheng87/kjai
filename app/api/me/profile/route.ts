import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireMemberApi } from "@/lib/member/guard";
import { getMemberProfile } from "@/lib/member/data";
import { requireDb } from "@/lib/db";
import { users } from "@/drizzle/schema";

const profileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
  bio: z.string().max(500).optional(),
});

export async function GET() {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  const profile = await getMemberProfile(guard.session!.user.id);
  if (!profile) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = profileSchema.parse(await request.json());
    const updates: Partial<{ name: string; image: string | null; bio: string | null }> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.image !== undefined) updates.image = body.image || null;
    if (body.bio !== undefined) updates.bio = body.bio || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "无有效更新字段" }, { status: 400 });
    }

    await requireDb()
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, guard.session!.user.id));

    const profile = await getMemberProfile(guard.session!.user.id);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请检查输入格式" }, { status: 400 });
    }
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6).max(100),
});

export async function PUT(request: Request) {
  const guard = await requireMemberApi();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const body = passwordSchema.parse(await request.json());
    const [user] = await requireDb()
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, guard.session!.user.id))
      .limit(1);

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "当前账号不支持密码修改" }, { status: 400 });
    }

    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }

    await requireDb()
      .update(users)
      .set({
        passwordHash: await bcrypt.hash(body.newPassword, 10),
        updatedAt: new Date(),
      })
      .where(eq(users.id, guard.session!.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
    }
    return NextResponse.json({ error: "密码修改失败" }, { status: 500 });
  }
}
