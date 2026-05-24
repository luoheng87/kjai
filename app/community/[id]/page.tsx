import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { getPostById } from "@/lib/data/community";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 300;

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/community" className="text-sm text-indigo-600 hover:underline">
          ← 返回论坛
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{post.title}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>{post.authorName ?? "匿名"}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>{post.likeCount} 赞</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-slate-700">
          {post.content}
        </div>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold">评论 ({post.comments.length})</h2>
          {post.comments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">暂无评论</p>
          ) : (
            <div className="mt-4 space-y-4">
              {post.comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-50 p-4 text-sm">
                  <p className="text-slate-700">{c.content}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {c.authorName ?? "匿名"} · {formatDate(c.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
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
  const post = await getPostById(id);
  return { title: post ? `${post.title} | ${SITE_NAME}` : SITE_NAME };
}
