"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SensitiveWordForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/moderation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: form.get("word") }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "添加失败");
      return;
    }
    formRef.current?.reset();
    setMessage("已添加");
    router.refresh();
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <Input name="word" placeholder="输入敏感词" required className="max-w-xs" />
        <Button type="submit" disabled={loading}>{loading ? "..." : "添加"}</Button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message === "已添加" ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
