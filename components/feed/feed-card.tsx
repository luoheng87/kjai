import Link from "next/link";
import { MessageSquare, Share2 } from "lucide-react";
import { VoteColumn } from "@/components/feed/vote-column";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FeedCardProps = {
  href: string;
  community: string;
  communityHref?: string;
  author?: string | null;
  time?: string;
  title: string;
  body?: string;
  voteScore?: number;
  commentCount?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warning";
  footer?: React.ReactNode;
  className?: string;
};

export function FeedCard({
  href,
  community,
  communityHref = "/",
  author,
  time,
  title,
  body,
  voteScore = 0,
  commentCount,
  badge,
  badgeVariant = "secondary",
  footer,
  className,
}: FeedCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-md border border-slate-200 bg-white hover:border-slate-300",
        className,
      )}
    >
      <div className="flex">
        <VoteColumn score={voteScore} />
        <div className="min-w-0 flex-1 p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-slate-500">
            <Link
              href={communityHref}
              className="font-bold text-slate-900 hover:underline"
            >
              r/{community}
            </Link>
            <span>•</span>
            {author && (
              <>
                <span>u/{author}</span>
                <span>•</span>
              </>
            )}
            {time && <span>{time}</span>}
            {badge && (
              <Badge variant={badgeVariant} className="ml-1">
                {badge}
              </Badge>
            )}
          </div>

          <Link href={href} className="mt-1 block">
            <h2 className="text-base font-medium text-slate-900 hover:text-orange-600 sm:text-lg">
              {title}
            </h2>
            {body && (
              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {body}
              </p>
            )}
          </Link>

          <div className="mt-2 flex items-center gap-3 text-xs font-bold text-slate-500">
            {commentCount !== undefined && (
              <Link
                href={href}
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100"
              >
                <MessageSquare className="h-4 w-4" />
                {commentCount} 评论
              </Link>
            )}
            <button
              type="button"
              className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100"
            >
              <Share2 className="h-4 w-4" />
              分享
            </button>
          </div>

          {footer}
        </div>
      </div>
    </article>
  );
}
