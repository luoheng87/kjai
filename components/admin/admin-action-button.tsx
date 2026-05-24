"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminActionButton({
  label,
  apiPath,
  method = "PATCH",
  body,
  variant = "outline",
  size = "sm" as const,
  confirmMsg,
}: {
  label: string;
  apiPath: string;
  method?: string;
  body: Record<string, unknown>;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default";
  confirmMsg?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setLoading(true);
    try {
      await fetch(apiPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size={size} variant={variant} onClick={handleClick} disabled={loading}>
      {loading ? "..." : label}
    </Button>
  );
}
