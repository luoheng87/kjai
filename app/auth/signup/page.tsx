"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/auth/signin");
    } else {
      const data = await res.json();
      setError(data.error ?? "注册失败");
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>注册</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">昵称</Label>
                <Input id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input id="password" name="password" type="password" minLength={6} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="role">账号类型</Label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                >
                  <option value="user">普通用户</option>
                  <option value="vendor">AI 厂商/服务商</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "注册中..." : "注册"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              已有账号？{" "}
              <Link href="/auth/signin" className="text-indigo-600 hover:underline">
                去登录
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
