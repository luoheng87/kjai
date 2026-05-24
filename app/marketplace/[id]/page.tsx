import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedDetailCard } from "@/components/feed/feed-detail-card";
import { ContactReveal } from "@/components/marketplace/contact-reveal";
import { getListingById } from "@/lib/data/marketplace";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export default async function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <SiteShell>
      <FeedDetailCard
        backHref="/marketplace"
        backLabel="返回服务市场"
        community="服务市场"
        communityHref="/marketplace"
        author={listing.authorName}
        time={formatDate(listing.createdAt)}
        title={listing.title}
        badge={listing.type === "demand" ? "需求" : "服务"}
        badgeVariant={listing.type === "demand" ? "default" : "success"}
      >
        <p className="leading-relaxed text-slate-600">{listing.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          {listing.budget && <span>预算：{listing.budget}</span>}
          {listing.deliveryTime && <span>交付：{listing.deliveryTime}</span>}
        </div>

        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold text-slate-900">联系方式</h2>
          <p className="mt-1 text-xs text-slate-500">
            登录后可查看，普通用户每日 3 次免费
          </p>
          <div className="mt-3">
            <ContactReveal listingId={listing.id} />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          免责声明：平台仅提供信息撮合，不参与线下交易与资金担保。
        </p>
      </FeedDetailCard>
    </SiteShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  return { title: listing ? `${listing.title} | ${SITE_NAME}` : SITE_NAME };
}
