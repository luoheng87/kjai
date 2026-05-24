import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
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
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/events" className="text-sm text-indigo-600 hover:underline">
          ← 返回活动列表
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{event.title}</h1>
        <p className="mt-4 text-slate-600">{event.description}</p>
        <p className="mt-2 text-sm text-slate-500">
          {formatDate(event.startsAt)}
          {event.location ? ` · ${event.location}` : ""}
        </p>

        {event.externalTicketUrl ? (
          <a
            href={event.externalTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block"
          >
            <Button size="lg">
              前往第三方购票
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        ) : (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>活动报名</CardTitle>
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
                <p className="text-xs text-slate-400">提交后工作人员将线下联系确认席位。</p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
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
