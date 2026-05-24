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
    revalidatePath(path);
  }
}

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || `item-${Date.now()}`
  );
}
