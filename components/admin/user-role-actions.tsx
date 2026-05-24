"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/constants";

const ROLE_LABELS: Record<UserRole, string> = {
  user: "普通用户",
  vip: "VIP 会员",
  vendor: "厂商/服务商",
  admin: "管理员",
};

export function UserRoleActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateRole(role: UserRole) {
    if (role === currentRole) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentRole}
      disabled={loading}
      onChange={(e) => updateRole(e.target.value as UserRole)}
      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
    >
      {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
        <option key={role} value={role}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}

export function GrantVipButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function grantVip() {
    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "vip", vipExpiresAt: expiresAt.toISOString() }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={grantVip} disabled={loading}>
      {loading ? "..." : "赠送1年VIP"}
    </Button>
  );
}
