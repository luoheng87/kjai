"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoteColumn({
  score = 0,
  className,
}: {
  score?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-10 shrink-0 flex-col items-center bg-slate-50/80 py-2 text-slate-500",
        className,
      )}
    >
      <button
        type="button"
        className="rounded p-0.5 hover:bg-orange-100 hover:text-orange-500"
        aria-label="点赞"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      <span className="text-xs font-bold text-slate-800">{score}</span>
      <button
        type="button"
        className="rounded p-0.5 hover:bg-slate-200 hover:text-slate-700"
        aria-label="踩"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}
