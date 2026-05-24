"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MemberActionButton({
  label,
  apiPath,
  method = "DELETE",
  body,
  confirmMsg,
}: {
  label: string;
  apiPath: string;
  method?: string;
  body: Record<string, unknown>;
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
    <Button size="sm" variant="outline" onClick={handleClick} disabled={loading}>
      {loading ? "..." : label}
    </Button>
  );
}
