import { cn } from "@/lib/utils";

/** 与顶栏导航对齐的全站内容宽度容器 */
export const SITE_CONTAINER_CLASS = "mx-auto w-full max-w-[1280px] px-4";

export function SiteContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(SITE_CONTAINER_CLASS, className)}>{children}</div>;
}
