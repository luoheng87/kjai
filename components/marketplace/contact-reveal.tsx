"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactReveal({ listingId }: { listingId: string }) {
  const [contacts, setContacts] = useState<{
    contactWechat?: string | null;
    contactWhatsapp?: string | null;
    contactTelegram?: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function reveal() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/marketplace/${listingId}/contact`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "无法查看");
      return;
    }
    setContacts(data);
  }

  if (contacts) {
    return (
      <div className="space-y-1 text-sm text-slate-700">
        {contacts.contactWechat && <p>微信：{contacts.contactWechat}</p>}
        {contacts.contactWhatsapp && <p>WhatsApp：{contacts.contactWhatsapp}</p>}
        {contacts.contactTelegram && <p>Telegram：{contacts.contactTelegram}</p>}
        {!contacts.contactWechat && !contacts.contactWhatsapp && !contacts.contactTelegram && (
          <p className="text-slate-400">发布者未留联系方式</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Button size="sm" onClick={reveal} disabled={loading}>
        {loading ? "加载中..." : "查看联系方式"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
