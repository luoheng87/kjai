"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { SiteLeftSidebar } from "@/components/layout/site-left-sidebar";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import {
  RIGHT_SIDEBAR_WIDTH,
  SIDEBAR_WIDTH,
  SITE_PAGE_GUTTER,
} from "@/components/layout/site-container";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kjai-sidebar-collapsed";

export function SiteFeedLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const showSidebar = mounted && !collapsed;

  return (
    <div className="flex w-full min-h-[calc(100dvh-3rem)]">
      {/* 左侧菜单：右边线从顶栏底部开始，无顶部间距 */}
      <aside
        className={cn(
          "hidden shrink-0 self-stretch flex-col overflow-hidden border-r border-slate-200 bg-[#dae0e6] transition-[width] duration-200 ease-out lg:flex",
          showSidebar ? "opacity-100" : "w-0 border-r-0 opacity-0",
        )}
        style={showSidebar ? { width: SIDEBAR_WIDTH } : undefined}
        aria-hidden={!showSidebar}
      >
        <div className="sticky top-12 h-[calc(100dvh-3rem)] overflow-y-auto py-2 pl-4 pr-3 lg:pl-6">
          <SiteLeftSidebar />
        </div>
      </aside>

      {/* 主内容 + 右侧栏 */}
      <div className="relative flex min-w-0 flex-1">
        {/* 折叠/展开按钮（桌面端，参照 Reddit 红框位置） */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={collapsed ? "展开导航" : "收起导航"}
          aria-label={collapsed ? "展开导航" : "收起导航"}
          aria-expanded={!collapsed}
          className={cn(
            "absolute z-20 hidden h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 lg:flex",
            collapsed ? "left-4 top-3" : "-left-[18px] top-3",
          )}
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className={cn("flex min-w-0 flex-1", SITE_PAGE_GUTTER)}>
          <main className="min-w-0 flex-1 pt-12 pb-6 lg:pr-4">{children}</main>

          <aside
            className="hidden shrink-0 xl:block"
            style={{ width: RIGHT_SIDEBAR_WIDTH }}
          >
            <div className="sticky top-12 py-2 pl-4">
              <SiteRightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
