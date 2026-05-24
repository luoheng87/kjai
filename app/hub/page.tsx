import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getApprovedTools } from "@/lib/data/tools";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `AI 工具商店 | ${SITE_NAME}`,
  description: "跨境 AI 厂商工具上架展示，含独家优惠码与跳转链接",
};

export const revalidate = 3600;

export default async function HubPage() {
  const tools = await getApprovedTools();

  return (
    <SiteShell>
      <div className="mb-3 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900">r/工具商店</h1>
          <p className="text-xs text-slate-500">厂商上架与优惠码</p>
        </div>
        <Link
          href="/vendor"
          className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          厂商上架
        </Link>
      </div>

      <FeedSortTabs />

      <div className="space-y-3">
        {tools.map((tool) => (
          <FeedCard
            key={tool.id}
            href={`/hub/${tool.slug}`}
            community="工具商店"
            communityHref="/hub"
            time={`${tool.clickCount} 次点击`}
            title={tool.name}
            body={tool.tagline ?? undefined}
            voteScore={tool.likeCount}
            badge={tool.isFeatured ? "精选" : tool.promoCode ? `码: ${tool.promoCode}` : undefined}
            badgeVariant="warning"
          />
        ))}
      </div>
    </SiteShell>
  );
}
