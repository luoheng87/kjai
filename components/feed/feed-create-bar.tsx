import Link from "next/link";
import { PenSquare } from "lucide-react";

export function FeedCreateBar() {
  return (
    <div className="mb-3 overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center gap-3 p-2 sm:p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
          AI
        </div>
        <Link
          href="/community/new"
          className="flex h-9 flex-1 items-center rounded-full border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 hover:border-slate-400 hover:bg-white"
        >
          创建帖子，分享你的出海经验...
        </Link>
        <Link
          href="/community/new"
          className="hidden items-center gap-1 rounded-full bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 sm:flex"
        >
          <PenSquare className="h-4 w-4" />
          发帖
        </Link>
      </div>
    </div>
  );
}
