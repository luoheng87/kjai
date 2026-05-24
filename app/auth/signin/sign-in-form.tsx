"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "./actions";

export function SignInForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [devMode, setDevMode] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "MissingCSRF") {
      setError("登录会话已过期，请重新提交（请使用 http://localhost:3000 访问）");
    }

    fetch("/api/auth/config")
      .then((r) => r.json())
      .then((data) => setDevMode(data.devMode))
      .catch(() => {});
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
          </CardHeader>
          <CardContent>
            {devMode && (
              <div className="mb-4 rounded-lg bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-800">
                <p className="font-medium">本地开发模式（无数据库）</p>
                <p className="mt-1">管理员：admin@kjai.com / admin123456</p>
                <p>厂商：vendor@kjai.com / vendor123456</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input id="password" name="password" type="password" required className="mt-1" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "登录中..." : "登录"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              还没有账号？{" "}
              <Link href="/auth/signup" className="text-indigo-600 hover:underline">
                立即注册
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
