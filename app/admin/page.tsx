import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats, getPendingModeration } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const moderation = await getPendingModeration();

  const cards = [
    { label: "待审核工具", value: stats.pendingTools, href: "/admin/hub", color: "text-indigo-600" },
    { label: "死链预警", value: stats.brokenLinks, href: "/admin/directory", color: "text-red-600" },
    { label: "待审内容", value: stats.pendingModeration, href: "/admin/moderation", color: "text-amber-600" },
    { label: "注册用户", value: stats.totalUsers, href: "/admin/users", color: "text-slate-700" },
    { label: "导航工具", value: stats.totalTools, href: "/admin/directory", color: "text-indigo-600" },
    { label: "服务发布", value: stats.totalListings, href: "/admin/marketplace", color: "text-emerald-600" },
    { label: "论坛帖子", value: stats.totalPosts, href: "/admin/community", color: "text-blue-600" },
    { label: "资讯文章", value: stats.totalArticles, href: "/admin/media", color: "text-violet-600" },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <form action="/api/admin/revalidate" method="POST">
            <input type="hidden" name="path" value="/" />
            <Button size="sm" variant="outline" type="submit">刷新全站缓存</Button>
          </form>
          <Link href="/admin/media"><Button size="sm" variant="outline">发布资讯</Button></Link>
          <Link href="/admin/hub"><Button size="sm" variant="outline">审核工具</Button></Link>
          <Link href="/admin/moderation"><Button size="sm" variant="outline">敏感词管理</Button></Link>
        </CardContent>
      </Card>

      {moderation.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">最新待审内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moderation.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{item.contentType}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-slate-600">{item.content}</p>
              </div>
            ))}
            <Link href="/admin/moderation" className="text-sm text-indigo-600 hover:underline">
              查看全部 →
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  );
}
