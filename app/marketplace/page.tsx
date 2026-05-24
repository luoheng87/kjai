import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getActiveListings } from "@/lib/data/marketplace";
import { formatDate } from "@/lib/utils";
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
      <div className="mb-3 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900">r/服务市场</h1>
          <p className="text-xs text-slate-500">需求与服务撮合</p>
        </div>
        <Link
          href="/marketplace/new"
          className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-orange-600"
        >
          发布
        </Link>
      </div>

      <FeedSortTabs />

      {listings.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          暂无发布，成为第一个发布者吧。
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <FeedCard
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              community="服务市场"
              communityHref="/marketplace"
              author={listing.authorName ?? undefined}
              time={formatDate(listing.createdAt)}
              title={listing.title}
              body={listing.description}
              badge={listing.type === "demand" ? "需求" : "服务"}
              badgeVariant={listing.type === "demand" ? "default" : "warning"}
              footer={
                <p className="mt-2 text-xs text-slate-500">
                  {listing.budget && `预算 ${listing.budget} · `}
                  {listing.deliveryTime && `交付 ${listing.deliveryTime} · `}
                  联系方式登录后可见
                </p>
              }
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400">
        平台不参与线下交易与资金担保，请自行核实风险。
      </p>
    </SiteShell>
  );
}
