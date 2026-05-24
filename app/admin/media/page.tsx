import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { ArticleForm } from "@/components/admin/article-form";
import { getArticlesAdmin } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminMediaPage() {
  const articles = await getArticlesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">资讯管理</h2>
        <p className="text-sm text-slate-500">发布快讯与深度报告，设置 VIP 付费墙</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">发布新文章</CardTitle></CardHeader>
        <CardContent><ArticleForm /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">文章列表 ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-sm text-slate-400">暂无文章，请使用上方表单发布</p>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div key={article.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{article.title}</p>
                      {article.isPremium && <Badge variant="warning">VIP</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{article.excerpt}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      /media/{article.slug} · {article.viewCount} 阅读 · {article.publishedAt ? formatDate(article.publishedAt) : "未发布"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!article.publishedAt && (
                      <AdminActionButton
                        label="审核通过"
                        apiPath="/api/admin/articles"
                        body={{ id: article.id, publishedAt: new Date().toISOString() }}
                      />
                    )}
                    {article.publishedAt && (
                      <Link href={`/media/${article.slug}`} target="_blank" className="text-sm text-indigo-600 hover:underline">
                        预览
                      </Link>
                    )}
                    <AdminActionButton
                      label={article.isPremium ? "取消VIP" : "设VIP"}
                      apiPath="/api/admin/articles"
                      body={{ id: article.id, isPremium: !article.isPremium }}
                    />
                    <AdminActionButton
                      label="删除"
                      apiPath="/api/admin/articles"
                      method="DELETE"
                      body={{ id: article.id }}
                      confirmMsg="确定删除该文章？"
                    />
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
