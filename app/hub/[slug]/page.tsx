import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">
            {tool.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">{tool.name}</h1>
              {tool.categoryName && <Badge variant="secondary">{tool.categoryName}</Badge>}
            </div>
            <p className="mt-2 text-lg text-slate-600">{tool.tagline}</p>
            {tool.priceRange && (
              <p className="mt-2 text-sm text-slate-500">价格区间：{tool.priceRange}</p>
            )}
          </div>
        </div>

        {tool.promoCode && (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="font-semibold text-amber-900">本站专属优惠码</p>
                <p className="mt-1 font-mono text-2xl text-amber-700">{tool.promoCode}</p>
              </div>
              <Badge variant="warning">限时有效</Badge>
            </CardContent>
          </Card>
        )}

        <div
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{
            __html: tool.content ?? `<p>${tool.description ?? tool.tagline}</p>`,
          }}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/go/${tool.id}?url=${encodeURIComponent(visitUrl)}`} target="_blank" rel="noopener noreferrer">
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
      </div>
    </SiteShell>
  );
}
