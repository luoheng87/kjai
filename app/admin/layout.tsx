import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { SITE_NAME } from "@/lib/constants";

export const metadata = { title: `管理后台 | ${SITE_NAME}` };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SiteShell>
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">管理后台</h1>
            <p className="mt-1 text-sm text-slate-500">
              欢迎，{session.user.name ?? session.user.email}
            </p>
          </div>
          {children}
        </div>
      </div>
    </SiteShell>
  );
}
