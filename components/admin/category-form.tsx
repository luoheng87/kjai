"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function CategoryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.get("slug"),
        name: form.get("name"),
        sortOrder: Number(form.get("sortOrder") || 0),
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "创建失败");
      return;
    }

    formRef.current?.reset();
    setMessage("分类已添加");
    router.refresh();
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="listing" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="name">名称</Label>
          <Input id="name" name="name" placeholder="Listing 优化" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="sortOrder">排序</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className="mt-1" />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "添加中..." : "添加分类"}
          </Button>
        </div>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message.includes("已添加") ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
