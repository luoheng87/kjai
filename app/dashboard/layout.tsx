import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: `会员中心 | ${SITE_NAME}` };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <SiteShell>
      <div className="flex gap-6">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SiteShell>
  );
}
