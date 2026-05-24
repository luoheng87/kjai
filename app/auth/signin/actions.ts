"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { devAuthorize, isDbConfigured } from "@/lib/auth-config";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "请填写邮箱和密码" };
  }

  let redirectTo = "/dashboard";
  if (!isDbConfigured()) {
    const devUser = devAuthorize(email, password);
    if (devUser?.role === "admin") redirectTo = "/admin";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "邮箱或密码错误，请检查后重试" };
    }
    throw error;
  }
}
