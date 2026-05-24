import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { ToolCard } from "@/components/tools/tool-card";
import { Button } from "@/components/ui/button";
import { getApprovedTools } from "@/lib/data/tools";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `AI 工具商店 | ${SITE_NAME}`,
  description: "跨境 AI 厂商工具上架展示，含独家优惠码与跳转链接",
};

export const revalidate = 3600;

export default async function HubPage() {
  const tools = await getApprovedTools();

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI 工具商店</h1>
            <p className="mt-2 text-slate-500">
              厂商自主上架，展示核心痛点、教程与优惠码，点击跳转第三方平台
            </p>
          </div>
          <Link href="/vendor">
            <Button variant="outline">厂商申请上架</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
