import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedCreateBar } from "@/components/feed/feed-create-bar";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getPublishedPosts } from "@/lib/data/community";
import { getUpcomingEvents } from "@/lib/data/events";
import { getPublishedArticles } from "@/lib/data/media";
import { getHotTools } from "@/lib/data/tools";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { articleHref, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export const revalidate = 300;

export default async function HomePage() {
  const [posts, hotTools, articles, events] = await Promise.all([
    getPublishedPosts().then((items) => items.slice(0, 5)),
    getHotTools(4),
    getPublishedArticles(3),
    getUpcomingEvents(2),
  ]);

  return (
    <SiteShell>
      <FeedCreateBar />
      <FeedSortTabs />

      <div className="space-y-3">
        {posts.map((post) => (
          <FeedCard
            key={`post-${post.id}`}
            href={`/community/${post.id}`}
            community="论坛"
            communityHref="/community"
            author={post.authorName ?? "匿名"}
            time={formatDate(post.createdAt)}
            title={post.title}
            body={post.content}
            voteScore={post.likeCount}
            commentCount={post.commentCount}
          />
        ))}

        {hotTools.map((tool) => (
          <FeedCard
            key={`tool-${tool.id}`}
            href={`/hub/${tool.slug}`}
            community="工具商店"
            communityHref="/hub"
            time={`${tool.clickCount} 次点击`}
            title={tool.name}
            body={tool.tagline ?? undefined}
            voteScore={tool.likeCount}
            badge={tool.isFeatured ? "精选" : tool.categoryName ?? undefined}
            badgeVariant={tool.isFeatured ? "warning" : "secondary"}
          />
        ))}

        {articles.map((article) => (
          <FeedCard
            key={`article-${article.id}`}
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

        {events.map((event) => (
          <FeedCard
            key={`event-${event.id}`}
            href={`/events/${event.slug}`}
            community="活动"
            communityHref="/events"
            time={formatDate(event.startsAt)}
            title={event.title}
            body={event.description}
            badge={event.location ?? "线上"}
          />
        ))}

        {posts.length === 0 && hotTools.length === 0 && articles.length === 0 && (
          <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            暂无内容，成为第一个发帖的人吧！
          </div>
        )}
      </div>
    </SiteShell>
  );
}
