import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { ToolReviewActions } from "@/components/admin/tool-review-actions";
import { ToolForm } from "@/components/admin/tool-form";
import { getAllToolsAdmin, getCategories, getPendingTools } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminHubPage() {
  const pending = await getPendingTools();
  const tools = await getAllToolsAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">工具商店管理</h2>
        <p className="text-sm text-slate-500">审核厂商提交、管理优惠码与价格区间</p>
      </div>

      {pending.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">待审核 ({pending.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.map((tool) => (
              <div key={tool.id} className="flex flex-wrap items-start justify-between gap-4 rounded-lg bg-amber-50/50 p-4">
                <div>
                  <p className="font-semibold">{tool.name}</p>
                  <p className="text-sm text-slate-600">{tool.tagline}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {tool.vendorName ?? tool.vendorEmail ?? "未知"} · {formatDate(tool.createdAt)}
                  </p>
                  <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                    {tool.websiteUrl}
                  </a>
                </div>
                <ToolReviewActions toolId={tool.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">直接添加工具</CardTitle></CardHeader>
        <CardContent>
          <ToolForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">全部工具 ({tools.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2 pr-4">名称</th>
                  <th className="pb-2 pr-4">分类</th>
                  <th className="pb-2 pr-4">优惠码</th>
                  <th className="pb-2 pr-4">状态</th>
                  <th className="pb-2 pr-4">数据</th>
                  <th className="pb-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-xs text-slate-400">{tool.tagline}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{tool.categoryName ?? "—"}</td>
                    <td className="py-3 pr-4">
                      {tool.promoCode ? (
                        <Badge variant="warning">{tool.promoCode}</Badge>
                      ) : "—"}
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={tool.status} /></td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {tool.clickCount} 点击 · {tool.likeCount} 赞
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {tool.status === "approved" && (
                          <AdminActionButton label="下架" apiPath="/api/admin/tools" body={{ id: tool.id, status: "rejected" }} />
                        )}
                        {tool.status === "rejected" && (
                          <AdminActionButton label="上架" apiPath="/api/admin/tools" body={{ id: tool.id, action: "approve" }} />
                        )}
                        <AdminActionButton label="删" apiPath="/api/admin/tools" method="DELETE" body={{ id: tool.id }} confirmMsg="确定删除？" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tools.length === 0 && <p className="py-4 text-sm text-slate-400">暂无工具</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
