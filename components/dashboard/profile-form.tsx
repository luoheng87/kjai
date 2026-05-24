"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

type Profile = {
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { update } = useSession();
  const profileFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        image: form.get("image"),
        bio: form.get("bio"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error ?? "保存失败");
      return;
    }
    await update({
      name: data.profile?.name ?? form.get("name"),
      image: data.profile?.image ?? form.get("image") ?? undefined,
    });
    setMessage("资料已保存");
    router.refresh();
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.get("currentPassword"),
        newPassword: form.get("newPassword"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setPasswordLoading(false);
    if (!res.ok) {
      setPasswordMessage(data.error ?? "密码修改失败");
      return;
    }
    passwordFormRef.current?.reset();
    setPasswordMessage("密码已更新");
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-slate-900">基本资料</h3>
        <form ref={profileFormRef} onSubmit={handleProfileSubmit} className="mt-4 space-y-3">
          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" value={profile.email} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label htmlFor="name">昵称</Label>
            <Input id="name" name="name" defaultValue={profile.name ?? ""} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="image">头像 URL</Label>
            <Input id="image" name="image" type="url" defaultValue={profile.image ?? ""} placeholder="https://..." className="mt-1" />
          </div>
          <div>
            <Label htmlFor="bio">个人简介</Label>
            <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} rows={4} maxLength={500} className="mt-1" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : "保存资料"}
          </Button>
          {message && (
            <p className={`text-sm ${message.includes("失败") ? "text-red-600" : "text-emerald-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <h3 className="text-base font-semibold text-slate-900">修改密码</h3>
        <form ref={passwordFormRef} onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
          <div>
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="newPassword">新密码</Label>
            <Input id="newPassword" name="newPassword" type="password" required minLength={6} className="mt-1" />
          </div>
          <Button type="submit" variant="outline" disabled={passwordLoading}>
            {passwordLoading ? "更新中..." : "更新密码"}
          </Button>
          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.includes("失败") || passwordMessage.includes("不正确") ? "text-red-600" : "text-emerald-600"}`}>
              {passwordMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
