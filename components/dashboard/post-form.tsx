"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function PostForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
        tags: form.get("tags"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "发布失败");
      return;
    }
    formRef.current?.reset();
    setMessage(data.message ?? "发布成功");
    router.refresh();
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
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
        <Button type="submit" disabled={loading}>
          {loading ? "发布中..." : "发布帖子"}
        </Button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message.includes("失败") || message.includes("敏感") ? "text-amber-600" : "text-emerald-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
