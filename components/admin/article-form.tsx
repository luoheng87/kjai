"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function ArticleForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug"),
        excerpt: form.get("excerpt"),
        content: form.get("content"),
        isPremium: form.get("isPremium") === "on",
        coverUrl: form.get("coverUrl"),
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg("发布成功");
      formRef.current?.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error ?? "发布失败");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="title">标题</Label>
        <Input id="title" name="title" required className="mt-1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug">Slug（可选）</Label>
          <Input id="slug" name="slug" placeholder="auto-from-title" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="coverUrl">封面图 URL</Label>
          <Input id="coverUrl" name="coverUrl" className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="excerpt">摘要</Label>
        <Input id="excerpt" name="excerpt" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="content">正文（支持 Markdown）</Label>
        <Textarea id="content" name="content" required rows={8} className="mt-1" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPremium" className="rounded" />
        VIP 付费可见（未付费用户仅试看 20%）
      </label>
      <Button type="submit" disabled={loading}>{loading ? "发布中..." : "发布文章"}</Button>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
