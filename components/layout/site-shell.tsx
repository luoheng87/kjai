import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteLeftSidebar } from "@/components/layout/site-left-sidebar";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";

export function SiteShell({
  children,
  variant = "feed",
}: {
  children: React.ReactNode;
  variant?: "feed" | "simple";
}) {
  if (variant === "simple") {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 justify-center px-4 py-8">{children}</main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex max-w-[1280px] gap-4 px-2 py-4 sm:px-4">
        <div className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-14">
            <SiteLeftSidebar />
          </div>
        </div>

        <main className="min-w-0 flex-1">{children}</main>

        <div className="hidden w-[312px] shrink-0 xl:block">
          <div className="sticky top-14">
            <SiteRightSidebar />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
