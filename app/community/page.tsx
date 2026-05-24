import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedCreateBar } from "@/components/feed/feed-create-bar";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getPublishedPosts } from "@/lib/data/community";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `论坛 | ${SITE_NAME}`,
  description: "跨境出海人交流社区，发帖回帖与标签分类",
};

export const revalidate = 300;

export default async function CommunityPage() {
  const posts = await getPublishedPosts();

  return (
    <SiteShell>
      <div className="mb-3 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900">r/论坛</h1>
          <p className="text-xs text-slate-500">{posts.length} 篇帖子</p>
        </div>
        <Link
          href="/community/new"
          className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-orange-600"
        >
          发帖
        </Link>
      </div>

      <FeedCreateBar />
      <FeedSortTabs />

      {posts.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          暂无帖子，来发布第一个话题吧。
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <FeedCard
              key={post.id}
              href={`/community/${post.id}`}
              community="论坛"
              communityHref="/community"
              author={post.authorName ?? "匿名"}
              time={formatDate(post.createdAt)}
              title={post.title}
              body={post.content}
              voteScore={post.likeCount}
              commentCount={post.commentCount}
              badge={post.tags[0]}
            />
          ))}
        </div>
      )}
    </SiteShell>
  );
}
