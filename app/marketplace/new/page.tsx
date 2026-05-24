"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewListingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("发布成功！审核通过后将展示在市场列表中。");
      e.currentTarget.reset();
    } else {
      const data = await res.json();
      setMessage(data.error ?? "发布失败，请先登录。");
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/marketplace" className="text-sm text-indigo-600 hover:underline">
          ← 返回服务市场
        </Link>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>发布需求 / 服务</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">类型</Label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  required
                >
                  <option value="demand">需求</option>
                  <option value="service">服务</option>
                </select>
              </div>
              <div>
                <Label htmlFor="title">标题</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">详情</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="budget">预算</Label>
                  <Input id="budget" name="budget" placeholder="如 5000-10000 元" />
                </div>
                <div>
                  <Label htmlFor="deliveryTime">交付时间</Label>
                  <Input id="deliveryTime" name="deliveryTime" placeholder="如 2 周内" />
                </div>
              </div>
              <div>
                <Label htmlFor="contactWechat">微信</Label>
                <Input id="contactWechat" name="contactWechat" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "提交中..." : "提交发布"}
              </Button>
              {message && <p className="text-sm text-slate-600">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
