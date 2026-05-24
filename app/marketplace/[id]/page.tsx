import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
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
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/marketplace" className="text-sm text-indigo-600 hover:underline">
          ← 返回服务市场
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant={listing.type === "demand" ? "default" : "success"}>
            {listing.type === "demand" ? "需求" : "服务"}
          </Badge>
          <span className="text-sm text-slate-400">{listing.authorName ?? "匿名"}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{listing.title}</h1>
        <p className="mt-4 leading-relaxed text-slate-600">{listing.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          {listing.budget && <span>预算：{listing.budget}</span>}
          {listing.deliveryTime && <span>交付：{listing.deliveryTime}</span>}
          <span>{formatDate(listing.createdAt)}</span>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="font-semibold text-slate-900">联系方式</h2>
          <p className="mt-1 text-sm text-slate-500">登录后可查看，普通用户每日 3 次免费</p>
          <div className="mt-4">
            <ContactReveal listingId={listing.id} />
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          免责声明：平台仅提供信息撮合，不参与线下交易与资金担保。
        </p>
      </div>
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
