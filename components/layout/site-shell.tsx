import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFeedLayout } from "@/components/layout/site-feed-layout";
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
      <SiteFeedLayout>{children}</SiteFeedLayout>
      <SiteFooter />
    </>
  );
}
