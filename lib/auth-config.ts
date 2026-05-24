import type { UserRole } from "@/lib/constants";

/** 本地开发无数据库时的测试账号 */
const DEV_ACCOUNTS: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  id: string;
}[] = [
  {
    email: "admin@kjai.com",
    password: "admin123456",
    name: "管理员",
    role: "admin",
    id: "dev-admin",
  },
  {
    email: "vendor@kjai.com",
    password: "vendor123456",
    name: "测试厂商",
    role: "vendor",
    id: "dev-vendor",
  },
  {
    email: "user@kjai.com",
    password: "user123456",
    name: "测试用户",
    role: "user",
    id: "dev-user",
  },
];

export function devAuthorize(email: string, password: string) {
  // 未配置真实数据库时，允许使用内置测试账号（不限 NODE_ENV）
  if (isDbConfigured()) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const account = DEV_ACCOUNTS.find(
    (a) => a.email === normalizedEmail && a.password === normalizedPassword,
  );
  if (!account) return null;

  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
  };
}

export function isDbConfigured() {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    return false;
  }
  if (url.includes("ep-xxx") || url.includes("user:password@")) {
    return false;
  }
  return true;
}
