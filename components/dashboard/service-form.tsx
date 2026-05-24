"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function ServiceForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        title: form.get("title"),
        description: form.get("description"),
        budget: form.get("budget"),
        deliveryTime: form.get("deliveryTime"),
        contactWechat: form.get("contactWechat"),
        contactWhatsapp: form.get("contactWhatsapp"),
        contactTelegram: form.get("contactTelegram"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "发布失败");
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
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">详情</Label>
          <Textarea id="description" name="description" required className="mt-1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="budget">预算</Label>
            <Input id="budget" name="budget" placeholder="如 5000-10000 元" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="deliveryTime">交付时间</Label>
            <Input id="deliveryTime" name="deliveryTime" placeholder="如 2 周内" className="mt-1" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="contactWechat">微信</Label>
            <Input id="contactWechat" name="contactWechat" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contactWhatsapp">WhatsApp</Label>
            <Input id="contactWhatsapp" name="contactWhatsapp" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="contactTelegram">Telegram</Label>
            <Input id="contactTelegram" name="contactTelegram" className="mt-1" />
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "发布服务"}
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
