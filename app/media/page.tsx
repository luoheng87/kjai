import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedArticles } from "@/lib/data/media";
import { formatDate, articleHref } from "@/lib/utils";
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">自媒体资讯</h1>
        <p className="mt-2 text-slate-500">快讯与深度报告，VIP 可解锁付费全文</p>

        {articles.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">暂无文章，请稍后再来。</p>
        ) : (
          <div className="mt-8 space-y-4">
            {articles.map((article) => (
              <Link key={article.id} href={articleHref(article.slug)}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">{article.title}</h2>
                      {article.isPremium && <Badge variant="warning">付费/VIP</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{article.excerpt}</p>
                    {article.publishedAt && (
                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(article.publishedAt)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
