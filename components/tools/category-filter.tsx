import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  activeSlug,
  basePath,
}: {
  categories: { slug: string; name: string }[];
  activeSlug?: string;
  basePath: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          !activeSlug
            ? "bg-orange-500 text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${basePath}?category=${cat.slug}`}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === cat.slug
              ? "bg-orange-500 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
