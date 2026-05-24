"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
        tags: form.get("tags"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      if (data.message) setMessage(data.message);
      router.push(`/community/${data.id}`);
    } else {
      setMessage(data.error ?? "发布失败");
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl py-6">
        <Link href="/community" className="text-sm text-indigo-600 hover:underline">
          ← 返回论坛
        </Link>
        <Card className="mt-4">
          <CardHeader><CardTitle>发布帖子</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <Input id="title" name="title" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="content">内容</Label>
                <Textarea id="content" name="content" required rows={6} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tags">标签（逗号分隔）</Label>
                <Input id="tags" name="tags" placeholder="独立站,SEO,AI" className="mt-1" />
              </div>
              {message && <p className="text-sm text-slate-600">{message}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "发布中..." : "发布"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
