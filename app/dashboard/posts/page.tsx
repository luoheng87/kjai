import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberActionButton } from "@/components/dashboard/member-action-button";
import { PostForm } from "@/components/dashboard/post-form";
import { auth } from "@/lib/auth";
import { getMemberPosts } from "@/lib/member/data";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  published: { label: "已发布", variant: "success" },
  hidden: { label: "审核中", variant: "warning" },
};

export default async function DashboardPostsPage() {
  const session = await auth();
  const posts = await getMemberPosts(session!.user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">我的帖子</h1>
        <p className="mt-1 text-sm text-slate-500">发布与管理论坛帖子</p>
      </div>

      {posts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">已发布 ({posts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.map((post) => {
              const status = STATUS_MAP[post.status] ?? { label: post.status, variant: "secondary" as const };
              return (
                <div
                  key={post.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <Link href={`/community/${post.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {post.title}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {formatDate(post.createdAt)} · {post.commentCount} 条评论
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <MemberActionButton
                      label="删除"
                      apiPath="/api/me/posts"
                      body={{ id: post.id }}
                      confirmMsg="确定删除这篇帖子？"
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
          <CardTitle className="text-base">发布新帖</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm />
        </CardContent>
      </Card>
    </div>
  );
}
