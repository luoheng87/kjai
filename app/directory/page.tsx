import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CategoryFilter } from "@/components/tools/category-filter";
import { ToolCard } from "@/components/tools/tool-card";
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900">AI 工具导航</h1>
          <p className="mt-2 text-slate-500">
            收录各类跨境 AI 工具，按场景分类，点击直达官网（含 Aff 推广追踪）
          </p>
        </div>

        <div className="mt-8">
          <CategoryFilter
            categories={DIRECTORY_CATEGORIES.map((c) => ({
              slug: c.slug,
              name: c.name,
            }))}
            activeSlug={category}
            basePath="/directory"
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {tools.length === 0 && (
          <p className="mt-12 text-center text-slate-500">该分类暂无工具，敬请期待。</p>
        )}
      </div>
    </SiteShell>
  );
}
