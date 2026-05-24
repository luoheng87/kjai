import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getPublishedArticles } from "@/lib/data/media";
import { articleHref, formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `资讯 | ${SITE_NAME}`,
  description: "全球跨境 AI 快讯与深度报告",
};

export const revalidate = 3600;

export default async function MediaPage() {
  const articles = await getPublishedArticles();

  return (
    <SiteShell>
      <div className="mb-3 rounded-md border border-slate-200 bg-white px-3 py-2">
        <h1 className="text-lg font-bold text-slate-900">r/资讯</h1>
        <p className="text-xs text-slate-500">快讯与深度报告</p>
      </div>

      <FeedSortTabs />

      {articles.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          暂无文章，请稍后再来。
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <FeedCard
              key={article.id}
              href={articleHref(article.slug)}
              community="资讯"
              communityHref="/media"
              time={article.publishedAt ? formatDate(article.publishedAt) : undefined}
              title={article.title}
              body={article.excerpt ?? undefined}
              badge={article.isPremium ? "VIP" : undefined}
              badgeVariant="warning"
            />
          ))}
        </div>
      )}
    </SiteShell>
  );
}
