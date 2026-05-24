/** 从文本提取英文 slug（仅 a-z0-9） */
export function slugifyAscii(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** 生成随机英文 slug，例如 article-1716543210-x7k2ab */
export function generateRandomSlug(prefix = "article") {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

/** 根据标题与可选自定义 slug 解析最终 slug（保证为英文） */
export function resolveArticleSlug(title: string, customSlug?: string | null) {
  const fromCustom = customSlug?.trim() ? slugifyAscii(customSlug) : "";
  if (fromCustom.length >= 2) return fromCustom;

  const fromTitle = slugifyAscii(title);
  if (fromTitle.length >= 2) return fromTitle;

  return generateRandomSlug("article");
}

/** 表单中根据标题建议 slug（中文标题会生成随机 slug） */
export function suggestArticleSlug(title: string) {
  const fromTitle = slugifyAscii(title);
  if (fromTitle.length >= 2) return fromTitle;
  return generateRandomSlug("article");
}
