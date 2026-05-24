import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** 资讯详情页 URL（正确处理中文 slug） */
export function articleHref(slug: string) {
  return `/media/${encodeURIComponent(slug)}`;
}

/** 从路由参数解析资讯 slug */
export function normalizeArticleSlug(raw: string) {
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}
