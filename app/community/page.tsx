import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">论坛社区</h1>
            <p className="mt-2 text-slate-500">分享经验、提问答疑，支持标签分类</p>
          </div>
          <Link
            href="/community/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            发帖
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">暂无帖子，来发布第一个话题吧。</p>
        ) : (
          <div className="mt-8 space-y-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{post.content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-slate-400">
                      <span>{post.authorName ?? "匿名"}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.likeCount} 赞</span>
                      <span>{post.commentCount} 评论</span>
                    </div>
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
