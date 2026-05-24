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
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        tagline: form.get("tagline"),
        websiteUrl: form.get("websiteUrl"),
        categoryId: form.get("categoryId") || null,
        affiliateSuffix: form.get("affiliateSuffix"),
        promoCode: form.get("promoCode"),
        priceRange: form.get("priceRange"),
        description: form.get("description"),
        isFeatured: form.get("isFeatured") === "on",
        status: "approved",
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg("添加成功");
      formRef.current?.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error ?? "添加失败");
    }
  }

  return (
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
          <Input id="tagline" name="tagline" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="categoryId">分类</Label>
          <select id="categoryId" name="categoryId" className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 px-3 text-sm">
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
        <Label htmlFor="description">描述</Label>
        <Textarea id="description" name="description" className="mt-1" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeatured" className="rounded" />
        设为精选（导航热度榜优先展示）
      </label>
      <Button type="submit" disabled={loading}>{loading ? "提交中..." : "添加工具"}</Button>
      {msg && <p className="text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
