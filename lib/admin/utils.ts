import { revalidatePath } from "next/cache";
import { resolveArticleSlug, slugifyAscii } from "@/lib/slug";

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
  const ascii = slugifyAscii(text);
  if (ascii.length >= 2) return ascii;
  return resolveArticleSlug(text);
}

export { resolveArticleSlug, suggestArticleSlug, generateRandomSlug } from "@/lib/slug";
