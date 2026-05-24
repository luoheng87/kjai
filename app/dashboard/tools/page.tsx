import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberActionButton } from "@/components/dashboard/member-action-button";
import { ToolForm } from "@/components/dashboard/tool-form";
import { auth } from "@/lib/auth";
import { getCategories } from "@/lib/data/admin";
import { getMemberTools } from "@/lib/member/data";
import { formatDate } from "@/lib/utils";

const STATUS_MAP = {
  pending: { label: "待审核", variant: "warning" as const },
  approved: { label: "已通过", variant: "success" as const },
  rejected: { label: "已拒绝", variant: "secondary" as const },
};

export default async function DashboardToolsPage() {
  const session = await auth();
  const [tools, categories] = await Promise.all([
    getMemberTools(session!.user.id),
    getCategories(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的工具</h1>
        <p className="mt-1 text-sm text-slate-500">提交 AI 工具信息，审核通过后上架至导航与商店</p>
      </div>

      {tools.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">已提交 ({tools.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tools.map((tool) => {
              const status = STATUS_MAP[tool.status];
              return (
                <div
                  key={tool.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{tool.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(tool.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {tool.status === "pending" && (
                      <MemberActionButton
                        label="撤回"
                        apiPath="/api/me/tools"
                        body={{ id: tool.id }}
                        confirmMsg="确定撤回该工具提交？"
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
          <CardTitle className="text-base">发布工具</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </CardContent>
      </Card>
    </div>
  );
}
