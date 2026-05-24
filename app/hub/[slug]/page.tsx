import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedDetailCard } from "@/components/feed/feed-detail-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAffiliateUrl, getToolBySlug } from "@/lib/data/tools";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  return {
    title: tool ? `${tool.name} | ${SITE_NAME}` : SITE_NAME,
    description: tool?.tagline ?? undefined,
  };
}

export default async function HubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const visitUrl = buildAffiliateUrl(tool.websiteUrl, tool.affiliateSuffix);

  return (
    <SiteShell>
      <FeedDetailCard
        backHref="/hub"
        backLabel="返回工具商店"
        community="工具商店"
        communityHref="/hub"
        title={tool.name}
        voteScore={tool.likeCount}
        badge={tool.categoryName ?? undefined}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-orange-50 text-xl font-bold text-orange-600">
            {tool.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm text-slate-600 sm:text-base">{tool.tagline}</p>
            {tool.priceRange && (
              <p className="mt-2 text-sm text-slate-500">价格区间：{tool.priceRange}</p>
            )}
          </div>
        </div>

        {tool.promoCode && (
          <Card className="mt-4 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-amber-900">本站专属优惠码</p>
                <p className="mt-1 font-mono text-xl text-amber-700">{tool.promoCode}</p>
              </div>
              <Badge variant="warning">限时有效</Badge>
            </CardContent>
          </Card>
        )}

        <div
          className="prose prose-slate mt-6 max-w-none text-sm sm:text-base"
          dangerouslySetInnerHTML={{
            __html: tool.content ?? `<p>${tool.description ?? tool.tagline}</p>`,
          }}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/go/${tool.id}?url=${encodeURIComponent(visitUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">
              立即使用
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/directory">
            <Button size="lg" variant="outline">
              返回导航
            </Button>
          </Link>
        </div>
      </FeedDetailCard>
    </SiteShell>
  );
}
