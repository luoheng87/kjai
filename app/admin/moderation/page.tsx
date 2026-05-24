import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { SensitiveWordForm } from "@/components/admin/sensitive-word-form";
import { getPendingModeration, getSensitiveWords } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminModerationPage() {
  const queue = await getPendingModeration();
  const words = await getSensitiveWords();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">内容审核</h2>
        <p className="text-sm text-slate-500">敏感词库管理与人工待审队列</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">敏感词库 ({words.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SensitiveWordForm />
          <div className="flex flex-wrap gap-2">
            {words.map((w) => (
              <div key={w.id} className="flex items-center gap-1 rounded-full bg-slate-100 pl-3 pr-1 py-1 text-sm">
                {w.word}
                <AdminActionButton
                  label="×"
                  apiPath="/api/admin/moderation"
                  method="DELETE"
                  body={{ id: w.id, type: "word" }}
                  variant="ghost"
                  size="sm"
                />
              </div>
            ))}
            {words.length === 0 && <p className="text-sm text-slate-400">暂无敏感词</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">人工待审队列 ({queue.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {queue.length === 0 ? (
            <p className="text-sm text-slate-400">暂无待审内容。论坛/评论命中敏感词后将自动进入此队列。</p>
          ) : (
            queue.map((item) => (
              <div key={item.id} className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">{item.contentType}</Badge>
                      <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{item.content}</p>
                    {item.reason && <p className="mt-1 text-xs text-red-600">{item.reason}</p>}
                  </div>
                  <div className="flex gap-2">
                    <AdminActionButton
                      label="通过"
                      apiPath="/api/admin/moderation"
                      body={{ id: item.id, action: "approve" }}
                    />
                    <AdminActionButton
                      label="拒绝"
                      apiPath="/api/admin/moderation"
                      body={{ id: item.id, action: "reject" }}
                    />
                    <AdminActionButton
                      label="删除"
                      apiPath="/api/admin/moderation"
                      method="DELETE"
                      body={{ id: item.id }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
