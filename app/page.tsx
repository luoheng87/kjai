import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Compass,
  MessageSquare,
  Newspaper,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ToolCard } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedArticles } from "@/lib/data/media";
import { getUpcomingEvents } from "@/lib/data/events";
import { getHotTools } from "@/lib/data/tools";
import { NAV_ITEMS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { articleHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export const revalidate = 3600;

const MODULE_ICONS = {
  "/directory": Compass,
  "/hub": ShoppingBag,
  "/marketplace": BarChart3,
  "/community": MessageSquare,
  "/media": Newspaper,
  "/events": Calendar,
} as const;

export default async function HomePage() {
  const [hotTools, articles, events] = await Promise.all([
    getHotTools(3),
    getPublishedArticles(2),
    getUpcomingEvents(2),
  ]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
            <Sparkles className="mr-1 h-3 w-3" />
            跨境出海 · AI 赋能
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-indigo-100">{SITE_DESCRIPTION}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/directory">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                探索 AI 工具
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                免费注册
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">六大核心模块</h2>
        <p className="mt-2 text-slate-500">覆盖工具发现、厂商上架、服务撮合到社区与资讯</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_ITEMS.map((item) => {
            const Icon = MODULE_ICONS[item.href];
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-all hover:border-indigo-200 hover:shadow-md">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-3">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">24 小时热度榜</h2>
              <p className="mt-1 text-slate-500">基于点击量与点赞的综合排名</p>
            </div>
            <Link href="/directory">
              <Button variant="outline">查看全部</Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {hotTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">最新资讯</h2>
            <div className="mt-6 space-y-4">
              {articles.map((article) => (
                <Link key={article.id} href={articleHref(article.slug)}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{article.title}</h3>
                        {article.isPremium && <Badge variant="warning">VIP</Badge>}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">近期活动</h2>
            <div className="mt-6 space-y-4">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-slate-900">{event.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{event.location}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
