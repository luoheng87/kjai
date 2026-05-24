import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
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
    : article.content.slice(0, previewLength) + "\n\n---\n\n🔒 后续内容需 VIP 会员解锁";

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>
          {article.isPremium && <Badge variant="warning">VIP 可见</Badge>}
        </div>
        {article.excerpt && (
          <p className="mt-4 text-lg text-slate-500">{article.excerpt}</p>
        )}
        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap">
          {displayContent}
        </div>
        {!canReadFull && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="font-medium text-amber-900">升级 VIP 解锁完整深度报告</p>
            <a
              href="/dashboard"
              className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              了解 VIP 权益
            </a>
          </div>
        )}
      </article>
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
