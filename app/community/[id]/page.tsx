import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedDetailCard } from "@/components/feed/feed-detail-card";
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
      <FeedDetailCard
        backHref="/community"
        backLabel="返回论坛"
        community="社区"
        communityHref="/community"
        author={post.authorName}
        time={formatDate(post.createdAt)}
        title={post.title}
        voteScore={post.likeCount}
      >
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 sm:text-base">
          {post.content}
        </div>
      </FeedDetailCard>

      <section className="mt-3 overflow-hidden rounded-md border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-900">
          评论 ({post.comments.length})
        </h2>
        {post.comments.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">暂无评论</p>
        ) : (
          <div className="mt-3 space-y-3">
            {post.comments.map((c) => (
              <div
                key={c.id}
                className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm"
              >
                <p className="text-slate-700">{c.content}</p>
                <p className="mt-2 text-xs text-slate-400">
                  u/{c.authorName ?? "匿名"} · {formatDate(c.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
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
