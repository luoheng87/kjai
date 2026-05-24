import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveListings } from "@/lib/data/marketplace";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `服务市场 | ${SITE_NAME}`,
  description: "跨境需求与服务信息撮合，联系方式需登录后查看",
};

export const revalidate = 3600;

export default async function MarketplacePage() {
  const listings = await getActiveListings();

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">服务市场</h1>
            <p className="mt-2 text-slate-500">
              轻量信息撮合模式，联系方式对游客锁定。普通用户每日 3 次免费查看，VIP 无限查看。
            </p>
          </div>
          <Link href="/marketplace/new">
            <Button>发布需求/服务</Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">暂无发布，成为第一个发布者吧。</p>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant={listing.type === "demand" ? "default" : "success"}>
                      {listing.type === "demand" ? "需求" : "服务"}
                    </Badge>
                    <CardTitle>{listing.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">{listing.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {listing.budget && <span>预算：{listing.budget}</span>}
                    {listing.deliveryTime && <span>交付：{listing.deliveryTime}</span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Lock className="h-4 w-4" />
                      联系方式已锁定
                    </div>
                    <Link href={`/marketplace/${listing.id}`}>
                      <Button size="sm" variant="outline">
                        查看详情
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          平台不参与线下交易与资金担保，买卖双方请自行核实并承担交易风险。
        </p>
      </div>
    </SiteShell>
  );
}
