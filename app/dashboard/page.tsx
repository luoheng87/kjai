import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, isVip } from "@/lib/auth";
import { FREE_CONTACT_VIEWS_PER_DAY } from "@/lib/constants";
import { getMemberProfile, getMemberStats } from "@/lib/member/data";
import {
  Calendar,
  FileText,
  MessageSquare,
  ShoppingBag,
  Store,
} from "lucide-react";

const QUICK_LINKS = [
  { href: "/dashboard/posts", label: "发帖", icon: MessageSquare, statKey: "posts" as const },
  { href: "/dashboard/articles", label: "发布资讯", icon: FileText, statKey: "articles" as const },
  { href: "/dashboard/tools", label: "发布工具", icon: Store, statKey: "tools" as const },
  { href: "/dashboard/services", label: "发布服务", icon: ShoppingBag, statKey: "services" as const },
  { href: "/dashboard/events", label: "发布活动", icon: Calendar, statKey: "events" as const },
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const vip = isVip(session!.user.role);
  const profile = await getMemberProfile(userId);
  const stats = await getMemberStats(userId);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">概览</h1>
          <p className="mt-1 text-sm text-slate-500">
            欢迎回来，{profile?.name ?? session!.user.name ?? session!.user.email}
          </p>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline" size="sm">个人设置</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              账号信息
              {vip && <Badge variant="warning">VIP</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>邮箱：{profile?.email ?? session!.user.email}</p>
            <p>角色：{profile?.role ?? session!.user.role}</p>
            {profile?.bio && <p>简介：{profile.bio}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">权益概览</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            {vip ? (
              <p>✓ 无限次查看服务市场联系方式</p>
            ) : (
              <p>✓ 每日 {FREE_CONTACT_VIEWS_PER_DAY} 次免费查看联系方式</p>
            )}
            <p>✓ 论坛发帖、发布资讯、工具、服务与活动</p>
            {vip ? (
              <p>✓ 解锁付费深度文章</p>
            ) : (
              <p>○ 付费文章需升级 VIP</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">已发布 {stats[item.statKey]} 条</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <form action="/api/auth/signout" method="POST" className="mt-8">
        <Button variant="ghost" type="submit">退出登录</Button>
      </form>
    </div>
  );
}
