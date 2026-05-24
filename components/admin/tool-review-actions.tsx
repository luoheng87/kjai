"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ToolReviewActions({ toolId }: { toolId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch("/api/admin/tools", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, action }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("approve")}
        disabled={!!loading}
      >
        {loading === "approve" ? "处理中..." : "通过"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("reject")}
        disabled={!!loading}
      >
        {loading === "reject" ? "处理中..." : "拒绝"}
      </Button>
    </div>
  );
}
