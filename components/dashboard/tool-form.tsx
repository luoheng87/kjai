"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

type Category = { id: string; name: string };

export function ToolForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        tagline: form.get("tagline"),
        websiteUrl: form.get("websiteUrl"),
        categoryId: form.get("categoryId") || null,
        affiliateSuffix: form.get("affiliateSuffix"),
        promoCode: form.get("promoCode"),
        description: form.get("description"),
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">工具名称</Label>
            <Input id="name" name="name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="websiteUrl">官网链接</Label>
            <Input id="websiteUrl" name="websiteUrl" type="url" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tagline">一句话简介</Label>
            <Input id="tagline" name="tagline" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="categoryId">分类</Label>
            <select
              id="categoryId"
              name="categoryId"
              className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
            >
              <option value="">无分类</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="affiliateSuffix">Aff 后缀</Label>
            <Input id="affiliateSuffix" name="affiliateSuffix" placeholder="ref=kjai" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="promoCode">优惠码</Label>
            <Input id="promoCode" name="promoCode" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="description">详细描述</Label>
          <Textarea id="description" name="description" className="mt-1" />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "提交工具"}
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
