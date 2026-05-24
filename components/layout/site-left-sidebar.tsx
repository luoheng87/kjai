"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Compass,
  Home,
  MessageSquare,
  Newspaper,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/directory": Compass,
  "/hub": Store,
  "/marketplace": ShoppingBag,
  "/community": MessageSquare,
  "/media": Newspaper,
  "/events": Calendar,
};

export function SiteLeftSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const linkClass = (href: string, exact = false) =>
    cn(
      "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
      (exact ? pathname === href : pathname.startsWith(href))
        ? "bg-slate-200/80 text-slate-900"
        : "text-slate-700 hover:bg-slate-200/60",
    );

  return (
    <nav className="space-y-1 p-2">
      <Link href="/" className={linkClass("/", true)} onClick={onNavigate}>
        <Home className="h-5 w-5" />
        首页
      </Link>

      <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        社区板块
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.href] ?? Sparkles;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
            onClick={onNavigate}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        快捷操作
      </div>

      <Link href="/community/new" className={linkClass("/community/new")} onClick={onNavigate}>
        <Plus className="h-5 w-5" />
        发帖
      </Link>
      <Link href="/dashboard" className={linkClass("/dashboard")} onClick={onNavigate}>
        <BarChart3 className="h-5 w-5" />
        会员中心
      </Link>

      <div className="mx-3 mt-6 rounded-md border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-800">{SITE_NAME}</p>
        <p className="mt-1">跨境出海 AI 工具导航、服务撮合与社区交流</p>
      </div>
    </nav>
  );
}
