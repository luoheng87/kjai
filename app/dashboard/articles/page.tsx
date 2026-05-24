import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleForm } from "@/components/dashboard/article-form";
import { MemberActionButton } from "@/components/dashboard/member-action-button";
import { auth } from "@/lib/auth";
import { getMemberArticles } from "@/lib/member/data";
import { formatDate } from "@/lib/utils";

export default async function DashboardArticlesPage() {
  const session = await auth();
  const articles = await getMemberArticles(session!.user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的资讯</h1>
        <p className="mt-1 text-sm text-slate-500">提交资讯内容，审核通过后展示在资讯频道</p>
      </div>

      {articles.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">已提交 ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  {article.publishedAt ? (
                    <Link href={`/media/${article.slug}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {article.title}
                    </Link>
                  ) : (
                    <p className="font-medium text-slate-900">{article.title}</p>
                  )}
                  <p className="text-xs text-slate-400">{formatDate(article.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={article.publishedAt ? "success" : "warning"}>
                    {article.publishedAt ? "已发布" : "审核中"}
                  </Badge>
                  {!article.publishedAt && (
                    <MemberActionButton
                      label="撤回"
                      apiPath="/api/me/articles"
                      body={{ id: article.id }}
                      confirmMsg="确定撤回这篇资讯？"
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">发布资讯</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm />
        </CardContent>
      </Card>
    </div>
  );
}
