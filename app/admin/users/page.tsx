import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GrantVipButton,
  UserRoleActions,
} from "@/components/admin/user-role-actions";
import { getAllUsers } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/lib/constants";

const ROLE_BADGE: Record<UserRole, "secondary" | "warning" | "success" | "default"> = {
  user: "secondary",
  vip: "warning",
  vendor: "success",
  admin: "default",
};

const ROLE_LABELS: Record<UserRole, string> = {
  user: "普通用户",
  vip: "VIP",
  vendor: "厂商",
  admin: "管理员",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户列表 ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-xs text-slate-400">
          修改角色后，对应用户需重新登录才能生效。
        </p>
        {users.length === 0 ? (
          <p className="text-sm text-slate-500">
            暂无用户。请配置数据库后运行 npm run db:seed 创建管理员账号。
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">用户</th>
                  <th className="pb-3 pr-4 font-medium">角色</th>
                  <th className="pb-3 pr-4 font-medium">VIP 到期</th>
                  <th className="pb-3 pr-4 font-medium">注册时间</th>
                  <th className="pb-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900">{user.name ?? "—"}</p>
                      <p className="text-slate-500">{user.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={ROLE_BADGE[user.role as UserRole]}>
                        {ROLE_LABELS[user.role as UserRole]}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {user.vipExpiresAt ? formatDate(user.vipExpiresAt) : "—"}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <UserRoleActions
                          userId={user.id}
                          currentRole={user.role as UserRole}
                        />
                        {user.role !== "vip" && user.role !== "admin" && (
                          <GrantVipButton userId={user.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
