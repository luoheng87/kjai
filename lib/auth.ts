import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, requireDb } from "@/lib/db";
import { devAuthorize, isDbConfigured } from "@/lib/auth-config";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/drizzle/schema";
import type { UserRole } from "@/lib/constants";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  adapter: db
    ? DrizzleAdapter(requireDb(), {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse({
          email: String(credentials?.email ?? "").trim().toLowerCase(),
          password: String(credentials?.password ?? "").trim(),
        });
        if (!parsed.success) return null;

        // 未配置真实数据库：使用内置测试账号
        if (!isDbConfigured()) {
          return devAuthorize(parsed.data.email, parsed.data.password);
        }

        try {
          const [user] = await db!
            .select()
            .from(users)
            .where(eq(users.email, parsed.data.email))
            .limit(1);

          if (!user?.passwordHash) {
            return devAuthorize(parsed.data.email, parsed.data.password);
          }

          const valid = await bcrypt.compare(
            parsed.data.password,
            user.passwordHash,
          );
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] database error:", error);
          return devAuthorize(parsed.data.email, parsed.data.password);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role ?? "user";
        token.sub = user.id;
        token.name = user.name;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
        if (session.image !== undefined) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = (token.role as UserRole) ?? "user";
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});

export function isVip(role: UserRole, vipExpiresAt?: Date | null) {
  if (role === "admin") return true;
  if (role !== "vip") return false;
  if (!vipExpiresAt) return true;
  return vipExpiresAt > new Date();
}

export { isDbConfigured };
