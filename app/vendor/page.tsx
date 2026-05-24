import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiTools } from "@/drizzle/schema";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: `商户工作台 | ${SITE_NAME}` };

const STATUS_BADGE = {
  pending: { label: "待审核", variant: "warning" as const },
  approved: { label: "已通过", variant: "success" as const },
  rejected: { label: "已拒绝", variant: "secondary" as const },
};

export default async function VendorPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  if (session.user.role !== "vendor" && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const { success, error } = await searchParams;

  const myTools = db
    ? await db
        .select({
          id: aiTools.id,
          name: aiTools.name,
          status: aiTools.status,
          createdAt: aiTools.createdAt,
        })
        .from(aiTools)
        .where(eq(aiTools.vendorId, session.user.id))
        .orderBy(desc(aiTools.createdAt))
    : [];

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl py-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-900">商户工作台</h1>
        </div>
        <p className="mt-2 text-slate-500">提交 AI 工具信息，审核通过后自动上架至导航与商店</p>

        {success && (
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            提交成功！工具已进入待审核队列，请等待管理员审核。
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            提交失败，请检查表单内容。
          </p>
        )}

        {myTools.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">我的工具</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myTools.map((tool) => {
                const badge = STATUS_BADGE[tool.status];
                return (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-xs text-slate-400">{formatDate(tool.createdAt)}</p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>提交新工具</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/vendor/tools" method="POST" className="space-y-4">
              <div>
                <Label htmlFor="name">工具名称</Label>
                <Input id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tagline">一句话简介</Label>
                <Input id="tagline" name="tagline" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="websiteUrl">官网链接</Label>
                <Input id="websiteUrl" name="websiteUrl" type="url" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="affiliateSuffix">Aff 推广后缀</Label>
                <Input id="affiliateSuffix" name="affiliateSuffix" placeholder="ref=kjai" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="promoCode">优惠码</Label>
                <Input id="promoCode" name="promoCode" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">详细描述</Label>
                <Textarea id="description" name="description" className="mt-1" />
              </div>
              <Button type="submit" className="w-full">
                提交审核
              </Button>
            </form>
          </CardContent>
        </Card>

        <Link href="/dashboard" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
          ← 返回会员中心
        </Link>
      </div>
    </SiteShell>
  );
}
