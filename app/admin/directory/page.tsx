import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { CategoryForm } from "@/components/admin/category-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { ToolForm } from "@/components/admin/tool-form";
import { getApprovedToolsAdmin, getCategories } from "@/lib/data/admin";
import { isDbConfigured } from "@/lib/auth-config";

export default async function AdminDirectoryPage() {
  const categories = await getCategories();
  const tools = await getApprovedToolsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI 导航管理</h2>
        <p className="text-sm text-slate-500">管理分类与导航展示工具，控制精选与外链状态</p>
      </div>

      {!isDbConfigured() && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          请配置 DATABASE_URL 并运行 npm run db:seed 以启用完整管理功能
        </p>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">分类管理</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <CategoryForm />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name} ({cat.slug})
              </Badge>
            ))}
            {categories.length === 0 && <p className="text-sm text-slate-400">暂无分类</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">添加导航工具</CardTitle></CardHeader>
        <CardContent>
          <ToolForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">已上架工具 ({tools.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-xs text-slate-400">{tool.websiteUrl} · {tool.clickCount} 点击</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {tool.isFeatured && <Badge variant="warning">精选</Badge>}
                  {tool.linkHealthy ? (
                    <Badge variant="success">链接正常</Badge>
                  ) : (
                    <Badge variant="warning">死链</Badge>
                  )}
                  <AdminActionButton
                    label={tool.isFeatured ? "取消精选" : "设为精选"}
                    apiPath="/api/admin/tools"
                    body={{ id: tool.id, isFeatured: !tool.isFeatured }}
                  />
                  {!tool.linkHealthy && (
                    <AdminActionButton
                      label="标记正常"
                      apiPath="/api/admin/tools"
                      body={{ id: tool.id, linkHealthy: true }}
                    />
                  )}
                  <AdminActionButton
                    label="删除"
                    apiPath="/api/admin/tools"
                    method="DELETE"
                    body={{ id: tool.id }}
                    confirmMsg="确定删除该工具？"
                  />
                </div>
              </div>
            ))}
            {tools.length === 0 && <p className="text-sm text-slate-400">暂无工具</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
