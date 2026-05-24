"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Bell,
  Menu,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HEADER_SEARCH_WIDTH, SITE_PAGE_GUTTER } from "@/components/layout/site-container";
import { SiteLeftSidebar } from "@/components/layout/site-left-sidebar";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoading = status === "loading";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-300/80 bg-white">
        <div className={cn("flex h-[55px] w-full items-center gap-4", SITE_PAGE_GUTTER)}>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="打开菜单"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex shrink-0 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="hidden font-bold text-slate-900 sm:inline">{SITE_NAME}</span>
            </Link>
          </div>

          <div className="flex min-w-0 flex-1 justify-center px-2 md:px-6">
            <form
              action="/directory"
              className="hidden w-full md:block"
              style={{ maxWidth: HEADER_SEARCH_WIDTH }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  type="search"
                  placeholder="搜索 AI 工具、帖子..."
                  className="h-9 w-full rounded-full border border-slate-300 bg-slate-100 pl-9 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </form>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            <Link href="/community/new" className="hidden sm:block">
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-full border-slate-300 px-3"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">发帖</span>
              </Button>
            </Link>

            <button
              type="button"
              className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:block"
              aria-label="通知"
            >
              <Bell className="h-5 w-5" />
            </button>

            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded-full bg-slate-100" />
            ) : session?.user ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-8 max-w-[120px] truncate rounded-full bg-orange-500 px-3 hover:bg-orange-600"
                >
                  {session.user.name ?? "我的"}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="sm" variant="ghost" className="h-8 rounded-full px-3">
                    登录
                  </Button>
                </Link>
                <Link href="/auth/signup" className="hidden sm:block">
                  <Button size="sm" className="h-8 rounded-full bg-orange-500 px-3 hover:bg-orange-600">
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="关闭菜单"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <span className="font-bold text-slate-900">{SITE_NAME}</span>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SiteLeftSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
