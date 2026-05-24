import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, requireDb } from "@/lib/db";
import { users } from "@/drizzle/schema";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "vendor"]).default("user"),
});

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "数据库未配置，请设置 DATABASE_URL" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const [existing] = await requireDb()
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const slug = data.email.split("@")[0];

    await requireDb().insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "输入数据无效" }, { status: 400 });
    }
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
