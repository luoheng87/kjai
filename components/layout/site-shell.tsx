import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteLeftSidebar } from "@/components/layout/site-left-sidebar";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import { SiteContainer } from "@/components/layout/site-container";

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
        <main className="flex flex-1 justify-center py-8">
          <SiteContainer>{children}</SiteContainer>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <SiteContainer className="py-4">
        <div className="flex min-h-[calc(100dvh-3rem)]">
          <aside className="hidden w-[240px] shrink-0 self-stretch border-r border-slate-200 lg:block">
            <div className="sticky top-12 py-2 pr-4">
              <SiteLeftSidebar />
            </div>
          </aside>

          <main className="min-w-0 flex-1 lg:pl-6">{children}</main>

          <aside className="hidden w-[312px] shrink-0 self-stretch xl:block xl:pl-6">
            <div className="sticky top-12 py-2">
              <SiteRightSidebar />
            </div>
          </aside>
        </div>
      </SiteContainer>
      <SiteFooter />
    </>
  );
}
