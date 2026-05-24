import { cn } from "@/lib/utils";

/** Reddit 风格布局尺寸 */
export const SIDEBAR_WIDTH = 272;
export const SIDEBAR_COLLAPSED_RAIL = 56;
export const COLLAPSED_MAIN_EXTRA_OFFSET = 100;
export const EXPANDED_MAIN_EXTRA_OFFSET = 25;
export const RIGHT_SIDEBAR_WIDTH = 316;
export const HEADER_HEIGHT = 55;
export const TOGGLE_TOP_OFFSET = 18;

/** 简单页（登录等）内容区最大宽度 */
export const SITE_CONTAINER_CLASS = "mx-auto w-full max-w-[1600px] px-4 lg:px-6";

/** Feed 页左右内边距，与顶栏对齐 */
export const SITE_PAGE_GUTTER = "px-4 lg:px-6";

export function SiteContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(SITE_CONTAINER_CLASS, className)}>{children}</div>;
}
