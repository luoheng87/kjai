import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DIRECTORY_CATEGORIES, NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteRightSidebar() {
  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div
          className="h-12 bg-gradient-to-r from-orange-500 to-orange-600"
          aria-hidden
        />
        <div className="p-3">
          <h2 className="text-sm font-bold text-slate-900">关于 {SITE_NAME}</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            面向跨境卖家的 AI 工具导航、应用商店、服务市场与出海社区。发现工具、发布需求、交流经验。
          </p>
          <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-center text-xs">
            <div>
              <p className="font-bold text-slate-900">{NAV_ITEMS.length}</p>
              <p className="text-slate-500">板块</p>
            </div>
            <div>
              <p className="font-bold text-slate-900">{DIRECTORY_CATEGORIES.length}</p>
              <p className="text-slate-500">分类</p>
            </div>
          </div>
          <Link href="/auth/signup" className="mt-3 block">
            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
              加入社区
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          热门分类
        </h3>
        <ul className="mt-2 space-y-1">
          {DIRECTORY_CATEGORIES.slice(0, 6).map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/directory?category=${cat.slug}`}
                className="block rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
              >
                r/{cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          社区规则
        </h3>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-600">
          <li>禁止发布虚假广告与诈骗信息</li>
          <li>服务交易请自行甄别风险</li>
          <li>尊重版权，引用请注明来源</li>
        </ol>
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-slate-400">
        © {new Date().getFullYear()} {SITE_NAME} · 外链工具由第三方提供
      </p>
    </aside>
  );
}
