import { revalidatePath } from "next/cache";

export function revalidateFrontend() {
  const paths = [
    "/",
    "/directory",
    "/hub",
    "/marketplace",
    "/community",
    "/media",
    "/events",
  ];
  for (const path of paths) {
    revalidatePath(path, "layout");
  }
}

export function slugify(text: string) {
  const normalized = text.trim().toLowerCase();
  const ascii = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  if (ascii) return ascii;

  const withCjk = normalized
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  if (withCjk && /^[\u4e00-\u9fa5-]+$/.test(withCjk)) {
    return withCjk;
  }

  return `article-${Date.now()}`;
}
