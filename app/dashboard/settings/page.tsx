import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { auth } from "@/lib/auth";
import { getMemberProfile } from "@/lib/member/data";

export default async function DashboardSettingsPage() {
  const session = await auth();
  const profile = await getMemberProfile(session!.user.id);

  if (!profile) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">个人设置</h1>
        <p className="mt-4 text-sm text-slate-500">请先配置数据库以保存个人资料。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">个人设置</h1>
        <p className="mt-1 text-sm text-slate-500">管理头像、昵称、简介与密码</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">账号资料</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={{
              name: profile.name,
              email: profile.email,
              image: profile.image,
              bio: profile.bio,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
