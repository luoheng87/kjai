import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedDetailCard } from "@/components/feed/feed-detail-card";
import { auth, isVip } from "@/lib/auth";
import { getArticleBySlug, getArticleMetaBySlug } from "@/lib/data/media";
import { ARTICLE_PREVIEW_RATIO, SITE_NAME } from "@/lib/constants";
import { normalizeArticleSlug } from "@/lib/utils";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normalizeArticleSlug(rawSlug);
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const session = await auth();
  const canReadFull =
    !article.isPremium ||
    isVip(session?.user?.role ?? "user") ||
    session?.user?.role === "admin";

  const previewLength = Math.floor(article.content.length * ARTICLE_PREVIEW_RATIO);
  const displayContent = canReadFull
    ? article.content
    : article.content.slice(0, previewLength) +
      "\n\n---\n\n🔒 后续内容需 VIP 会员解锁";

  return (
    <SiteShell>
      <FeedDetailCard
        backHref="/media"
        backLabel="返回资讯"
        community="资讯"
        communityHref="/media"
        title={article.title}
        badge={article.isPremium ? "VIP 可见" : undefined}
        badgeVariant="warning"
      >
        {article.excerpt && (
          <p className="mb-4 text-sm text-slate-500 sm:text-base">{article.excerpt}</p>
        )}
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm sm:text-base">
          {displayContent}
        </div>
        {!canReadFull && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="font-medium text-amber-900">升级 VIP 解锁完整深度报告</p>
            <a
              href="/dashboard"
              className="mt-3 inline-block rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
            >
              了解 VIP 权益
            </a>
          </div>
        )}
      </FeedDetailCard>
    </SiteShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const article = await getArticleMetaBySlug(normalizeArticleSlug(rawSlug));
  return {
    title: article ? `${article.title} | ${SITE_NAME}` : SITE_NAME,
    description: article?.excerpt ?? undefined,
  };
}
