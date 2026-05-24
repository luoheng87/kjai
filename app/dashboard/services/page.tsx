import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberActionButton } from "@/components/dashboard/member-action-button";
import { ServiceForm } from "@/components/dashboard/service-form";
import { auth } from "@/lib/auth";
import { getMemberListings } from "@/lib/member/data";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  active: { label: "已上架", variant: "success" },
  pending: { label: "审核中", variant: "warning" },
  archived: { label: "已下架", variant: "secondary" },
};

const TYPE_LABEL = { demand: "需求", service: "服务" };

export default async function DashboardServicesPage() {
  const session = await auth();
  const listings = await getMemberListings(session!.user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的服务</h1>
        <p className="mt-1 text-sm text-slate-500">发布需求或服务，审核通过后展示在服务市场</p>
      </div>

      {listings.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">已发布 ({listings.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.map((listing) => {
              const status = STATUS_MAP[listing.status] ?? { label: listing.status, variant: "secondary" as const };
              return (
                <div
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      <span className="mr-2 text-xs text-slate-400">{TYPE_LABEL[listing.type]}</span>
                      {listing.title}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(listing.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {listing.status === "active" && (
                      <MemberActionButton
                        label="下架"
                        apiPath="/api/me/services"
                        method="PATCH"
                        body={{ id: listing.id, action: "archive" }}
                        confirmMsg="确定下架该服务？"
                      />
                    )}
                    <MemberActionButton
                      label="删除"
                      apiPath="/api/me/services"
                      body={{ id: listing.id }}
                      confirmMsg="确定删除？"
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">发布服务 / 需求</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
