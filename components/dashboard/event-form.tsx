"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function EventForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug"),
        description: form.get("description"),
        location: form.get("location"),
        coverUrl: form.get("coverUrl"),
        startsAt: form.get("startsAt"),
        endsAt: form.get("endsAt"),
        externalTicketUrl: form.get("externalTicketUrl"),
        useInternalForm: form.get("useInternalForm") === "on",
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "提交失败");
      return;
    }
    formRef.current?.reset();
    setMessage(data.message ?? "已提交审核");
    router.refresh();
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="title">活动标题</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">Slug（可选）</Label>
            <Input id="slug" name="slug" placeholder="自动生成" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="location">地点</Label>
            <Input id="location" name="location" placeholder="深圳 · 南山 / 线上" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="description">活动介绍</Label>
          <Textarea id="description" name="description" required rows={5} className="mt-1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="startsAt">开始时间</Label>
            <Input id="startsAt" name="startsAt" type="datetime-local" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="endsAt">结束时间（可选）</Label>
            <Input id="endsAt" name="endsAt" type="datetime-local" className="mt-1" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="coverUrl">封面图 URL</Label>
            <Input id="coverUrl" name="coverUrl" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="externalTicketUrl">外部购票链接（可选）</Label>
            <Input id="externalTicketUrl" name="externalTicketUrl" type="url" className="mt-1" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="useInternalForm" className="rounded" />
          使用站内报名表单
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "发布活动"}
        </Button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message.includes("失败") ? "text-red-600" : "text-emerald-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
