"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { SiteLeftSidebar } from "@/components/layout/site-left-sidebar";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import {
  HEADER_HEIGHT,
  RIGHT_SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSED_RAIL,
  SIDEBAR_WIDTH,
  TOGGLE_TOP_OFFSET,
} from "@/components/layout/site-container";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kjai-sidebar-collapsed";
const TOGGLE_SIZE = 36;

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

  const expanded = !mounted || !collapsed;
  const leftColumnWidth = expanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_RAIL;
  const toggleLeft = leftColumnWidth - TOGGLE_SIZE / 2;
  const sidebarHeight = `calc(100dvh - ${HEADER_HEIGHT}px)`;

  return (
    <div className="flex w-full bg-white">
      {/* 左侧菜单：固定，超出视口时自身滚动 */}
      <aside
        className={cn(
          "fixed left-0 z-20 hidden flex-col overflow-y-auto overscroll-y-contain border-r border-slate-200 bg-white transition-[width] duration-200 ease-out lg:flex",
        )}
        style={{
          top: HEADER_HEIGHT,
          width: leftColumnWidth,
          height: sidebarHeight,
        }}
      >
        {expanded && (
          <div className="py-2 pl-4 pr-3 lg:pl-6">
            <SiteLeftSidebar />
          </div>
        )}
      </aside>

      {/* 占位，避免主体被固定侧栏遮挡 */}
      <div
        className="hidden shrink-0 lg:block"
        style={{ width: leftColumnWidth }}
        aria-hidden
      />

      <button
        type="button"
        onClick={toggleSidebar}
        title={collapsed && mounted ? "展开导航" : "收起导航"}
        aria-label={collapsed && mounted ? "展开导航" : "收起导航"}
        aria-expanded={expanded}
        className="fixed z-30 hidden h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:flex"
        style={{
          top: HEADER_HEIGHT + TOGGLE_TOP_OFFSET,
          left: toggleLeft,
        }}
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* 中间 + 右侧：随页面滚动 */}
      <div
        className={cn(
          "flex min-w-0 flex-1 bg-white",
          expanded ? "px-4 pr-4 lg:pr-6 lg:pl-[49px]" : "px-4 pr-4 lg:pr-6 lg:pl-[124px]",
        )}
      >
        <main className="min-w-0 flex-1 pt-12 pb-6 lg:pr-4">{children}</main>

        <aside
          className="hidden shrink-0 bg-white xl:block"
          style={{ width: RIGHT_SIDEBAR_WIDTH }}
        >
          <div className="py-2 pl-4">
            <SiteRightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
