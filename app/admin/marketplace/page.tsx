import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { getMarketplaceListingsAdmin } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminMarketplacePage() {
  const listings = await getMarketplaceListingsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">服务市场管理</h2>
        <p className="text-sm text-slate-500">审核需求/服务发布，管理上架状态</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">全部发布 ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <p className="text-sm text-slate-400">暂无发布，用户可在前台 /marketplace/new 提交</p>
          ) : (
            <div className="space-y-4">
              {listings.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.type} />
                        <StatusBadge status={item.status === "active" ? "active" : "inactive"} />
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.description}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        {item.budget && <span>预算：{item.budget}</span>}
                        <span>{item.authorName ?? item.authorEmail ?? "匿名"}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.status === "active" ? (
                        <AdminActionButton
                          label="下架"
                          apiPath="/api/admin/marketplace"
                          body={{ id: item.id, status: "inactive" }}
                        />
                      ) : (
                        <AdminActionButton
                          label="上架"
                          apiPath="/api/admin/marketplace"
                          body={{ id: item.id, status: "active" }}
                        />
                      )}
                      <AdminActionButton
                        label="删除"
                        apiPath="/api/admin/marketplace"
                        method="DELETE"
                        body={{ id: item.id }}
                        confirmMsg="确定删除？"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
