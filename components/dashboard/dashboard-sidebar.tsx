"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/posts", label: "我的帖子", icon: MessageSquare },
  { href: "/dashboard/articles", label: "我的资讯", icon: FileText },
  { href: "/dashboard/tools", label: "我的工具", icon: Store },
  { href: "/dashboard/services", label: "我的服务", icon: ShoppingBag },
  { href: "/dashboard/events", label: "我的活动", icon: Calendar },
  { href: "/dashboard/settings", label: "个人设置", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0">
      <div className="sticky top-24">
        <p className="mb-3 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <User className="h-3.5 w-3.5" />
          会员中心
        </p>
        <nav className="space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
