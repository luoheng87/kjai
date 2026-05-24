"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "热门" },
  { href: "/community", label: "论坛" },
  { href: "/media", label: "资讯" },
  { href: "/directory", label: "工具" },
] as const;

export function FeedSortTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-3 flex overflow-hidden rounded-md border border-slate-200 bg-white">
      {TABS.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 border-b-2 px-3 py-2.5 text-center text-sm font-bold transition-colors",
              active
                ? "border-orange-500 text-slate-900"
                : "border-transparent text-slate-500 hover:bg-slate-50",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
