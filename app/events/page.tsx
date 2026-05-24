import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedSortTabs } from "@/components/feed/feed-sort-tabs";
import { getUpcomingEvents } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `行业活动 | ${SITE_NAME}`,
  description: "跨境 AI 沙龙、峰会与线上直播",
};

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <SiteShell>
      <div className="mb-3 rounded-md border border-slate-200 bg-white px-3 py-2">
        <h1 className="text-lg font-bold text-slate-900">r/活动</h1>
        <p className="text-xs text-slate-500">沙龙、峰会与线上直播</p>
      </div>

      <FeedSortTabs />

      {events.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          暂无活动，敬请关注。
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <FeedCard
              key={event.id}
              href={`/events/${event.slug}`}
              community="活动"
              communityHref="/events"
              time={formatDate(event.startsAt)}
              title={event.title}
              body={event.description}
              badge={event.location ?? "报名中"}
            />
          ))}
        </div>
      )}
    </SiteShell>
  );
}
