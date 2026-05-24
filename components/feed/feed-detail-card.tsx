import Link from "next/link";
import { VoteColumn } from "@/components/feed/vote-column";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FeedDetailCardProps = {
  backHref: string;
  backLabel: string;
  community: string;
  communityHref?: string;
  author?: string | null;
  time?: string;
  title: string;
  voteScore?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warning" | "success";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function FeedDetailCard({
  backHref,
  backLabel,
  community,
  communityHref = "/",
  author,
  time,
  title,
  voteScore = 0,
  badge,
  badgeVariant = "secondary",
  children,
  footer,
  className,
}: FeedDetailCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Link
        href={backHref}
        className="inline-block text-xs font-bold text-slate-500 hover:text-orange-600"
      >
        ← {backLabel}
      </Link>

      <article className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex">
          <VoteColumn score={voteScore} />
          <div className="min-w-0 flex-1 p-3 sm:p-4">
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

            <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              {title}
            </h1>

            <div className="mt-4">{children}</div>

            {footer}
          </div>
        </div>
      </article>
    </div>
  );
}
