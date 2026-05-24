import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CategoryFilter } from "@/components/tools/category-filter";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getApprovedTools } from "@/lib/data/tools";
import { DIRECTORY_CATEGORIES, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `AI 导航 | ${SITE_NAME}`,
  description: "按业务场景筛选跨境 AI 工具，直达官网并追踪热度",
};

export const revalidate = 3600;

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const tools = await getApprovedTools(category);

  return (
    <SiteShell>
      <div className="mb-3 rounded-md border border-slate-200 bg-white px-3 py-2">
        <h1 className="text-lg font-bold text-slate-900">r/AI导航</h1>
        <p className="text-xs text-slate-500">按场景筛选跨境 AI 工具</p>
      </div>

      <FeedSortTabs />

      <div className="mb-3 rounded-md border border-slate-200 bg-white p-3">
        <CategoryFilter
          categories={DIRECTORY_CATEGORIES.map((c) => ({
            slug: c.slug,
            name: c.name,
          }))}
          activeSlug={category}
          basePath="/directory"
        />
      </div>

      {tools.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          该分类暂无工具，敬请期待。
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map((tool) => (
            <FeedCard
              key={tool.id}
              href={`/hub/${tool.slug}`}
              community={tool.categoryName ?? "AI导航"}
              communityHref="/directory"
              time={`${tool.clickCount} 次点击 · ${tool.rating.toFixed(1)} 分`}
              title={tool.name}
              body={tool.tagline ?? undefined}
              voteScore={tool.likeCount}
              badge={tool.isFeatured ? "精选" : undefined}
              badgeVariant="warning"
              footer={
                <div className="mt-2 flex gap-2">
                  <a
                    href={`/go/${tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white hover:bg-orange-600"
                  >
                    直达官网
                  </a>
                </div>
              }
            />
          ))}
        </div>
      )}
    </SiteShell>
  );
}
