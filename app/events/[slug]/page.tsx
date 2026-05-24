import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { FeedDetailCard } from "@/components/feed/feed-detail-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { getEventBySlug } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <SiteShell>
      <FeedDetailCard
        backHref="/events"
        backLabel="返回活动列表"
        community="活动"
        communityHref="/events"
        time={formatDate(event.startsAt)}
        title={event.title}
        badge={event.location ?? undefined}
      >
        <p className="text-slate-600">{event.description}</p>
        {event.location && (
          <p className="mt-2 text-sm text-slate-500">地点：{event.location}</p>
        )}

        {event.externalTicketUrl ? (
          <a
            href={event.externalTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block"
          >
            <Button size="lg">
              前往第三方购票
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">活动报名</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="/api/events/register" method="POST" className="space-y-4">
                <input type="hidden" name="eventId" value={event.id} />
                <div>
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" name="name" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">电话</Label>
                  <Input id="phone" name="phone" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="company">公司</Label>
                  <Input id="company" name="company" className="mt-1" />
                </div>
                <Button type="submit" className="w-full">
                  提交报名
                </Button>
                <p className="text-xs text-slate-400">
                  提交后工作人员将线下联系确认席位。
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </FeedDetailCard>
    </SiteShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? `${event.title} | ${SITE_NAME}` : SITE_NAME };
}
