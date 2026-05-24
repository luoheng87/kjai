"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-[120px] items-center justify-end gap-2">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : session?.user ? (
            <>
              {session.user.role === "vip" && (
                <Badge variant="warning">VIP</Badge>
              )}
              {session.user.role === "vendor" && (
                <Link href="/vendor" prefetch>
                  <Button variant="outline" size="sm">
                    商户工作台
                  </Button>
                </Link>
              )}
              {session.user.role === "admin" && (
                <Link href="/admin" prefetch>
                  <Button variant="outline" size="sm">
                    管理后台
                  </Button>
                </Link>
              )}
              <Link href="/dashboard" prefetch>
                <Button variant="secondary" size="sm">
                  会员中心
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin" prefetch>
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/auth/signup" prefetch>
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
