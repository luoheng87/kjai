import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { getForumCommentsAdmin, getForumPostsAdmin } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminCommunityPage() {
  const posts = await getForumPostsAdmin();
  const comments = await getForumCommentsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">论坛社区管理</h2>
        <p className="text-sm text-slate-500">管理帖子与评论，隐藏违规内容</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">帖子列表 ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-400">暂无帖子</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <StatusBadge status={post.status === "published" ? "published" : "hidden"} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.content}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags?.split(",").map((tag) => (
                        <Badge key={tag} variant="secondary">{tag.trim()}</Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {post.authorName ?? "匿名"} · {formatDate(post.createdAt)} · {post.likeCount} 赞 · {post.commentCount} 评论
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {post.status === "published" ? (
                      <AdminActionButton
                        label="隐藏"
                        apiPath="/api/admin/community"
                        body={{ type: "post", id: post.id, status: "hidden" }}
                      />
                    ) : (
                      <AdminActionButton
                        label="恢复"
                        apiPath="/api/admin/community"
                        body={{ type: "post", id: post.id, status: "published" }}
                      />
                    )}
                    <AdminActionButton
                      label="删除"
                      apiPath="/api/admin/community"
                      method="DELETE"
                      body={{ type: "post", id: post.id }}
                      confirmMsg="确定删除该帖子？"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">最新评论 ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400">暂无评论</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-100 p-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">回复：{c.postTitle}</p>
                  <p className="mt-1 text-slate-700">{c.content}</p>
                  <p className="mt-1 text-xs text-slate-400">{c.authorName} · {formatDate(c.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={c.status === "published" ? "published" : "hidden"} />
                  <AdminActionButton
                    label="隐藏"
                    apiPath="/api/admin/community"
                    body={{ type: "comment", id: c.id, status: "hidden" }}
                  />
                  <AdminActionButton
                    label="删"
                    apiPath="/api/admin/community"
                    method="DELETE"
                    body={{ type: "comment", id: c.id }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
