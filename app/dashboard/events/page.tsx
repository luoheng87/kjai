import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/dashboard/event-form";
import { MemberActionButton } from "@/components/dashboard/member-action-button";
import { auth } from "@/lib/auth";
import { getMemberEvents } from "@/lib/member/data";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  published: { label: "已发布", variant: "success" },
  pending: { label: "审核中", variant: "warning" },
};

export default async function DashboardEventsPage() {
  const session = await auth();
  const events = await getMemberEvents(session!.user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的活动</h1>
        <p className="mt-1 text-sm text-slate-500">发布跨境 AI 相关活动，审核通过后展示在活动频道</p>
      </div>

      {events.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">已提交 ({events.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.map((event) => {
              const status = STATUS_MAP[event.status] ?? { label: event.status, variant: "secondary" as const };
              return (
                <div
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    {event.status === "published" ? (
                      <Link href={`/events/${event.slug}`} className="font-medium text-slate-900 hover:text-indigo-600">
                        {event.title}
                      </Link>
                    ) : (
                      <p className="font-medium text-slate-900">{event.title}</p>
                    )}
                    <p className="text-xs text-slate-400">
                      {formatDate(event.startsAt)}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {event.status === "pending" && (
                      <MemberActionButton
                        label="撤回"
                        apiPath="/api/me/events"
                        body={{ id: event.id }}
                        confirmMsg="确定撤回该活动？"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">发布活动</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </div>
  );
}
