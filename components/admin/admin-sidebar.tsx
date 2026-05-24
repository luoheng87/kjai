"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Shield,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "概览", icon: LayoutDashboard, exact: true },
  { href: "/admin/directory", label: "AI 导航", icon: Compass },
  { href: "/admin/hub", label: "工具商店", icon: Store },
  { href: "/admin/marketplace", label: "服务市场", icon: ShoppingBag },
  { href: "/admin/community", label: "论坛社区", icon: MessageSquare },
  { href: "/admin/media", label: "资讯管理", icon: Newspaper },
  { href: "/admin/users", label: "会员管理", icon: Users },
  { href: "/admin/moderation", label: "内容审核", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0">
      <nav className="sticky top-24 space-y-0.5">
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
    </aside>
  );
}
