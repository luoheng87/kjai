"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { suggestArticleSlug } from "@/lib/slug";

export function ArticleSlugField({ title }: { title: string }) {
  const [slug, setSlug] = useState("");
  const slugTouched = useRef(false);

  useEffect(() => {
    if (slugTouched.current || !title.trim()) return;
    setSlug(suggestArticleSlug(title));
  }, [title]);

  function regenerate() {
    setSlug(suggestArticleSlug(title || "article"));
    slugTouched.current = false;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="slug">Slug（英文 URL）</Label>
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={regenerate}>
          重新生成
        </Button>
      </div>
      <Input
        id="slug"
        name="slug"
        value={slug}
        onChange={(e) => {
          slugTouched.current = true;
          setSlug(e.target.value);
        }}
        placeholder="留空则根据标题自动生成"
        className="mt-1 font-mono text-sm"
      />
      <p className="mt-1 text-xs text-slate-400">
        {slug ? `预览：/media/${slug}` : "中文标题将自动生成随机英文 slug"}
      </p>
    </div>
  );
}
