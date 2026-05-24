import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">行业活动</h1>
        <p className="mt-2 text-slate-500">沙龙、峰会与线上直播，支持第三方票务或站内报名</p>

        {events.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">暂无活动，敬请关注。</p>
        ) : (
          <div className="mt-8 space-y-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900">{event.title}</h2>
                  <p className="mt-2 text-slate-600">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.startsAt)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link href={`/events/${event.slug}`}>
                      <Button>查看详情 / 报名</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
