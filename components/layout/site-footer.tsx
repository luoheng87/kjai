import Link from "next/link";
import { NAV_ITEMS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{SITE_NAME}</h3>
            <p className="mt-2 text-sm text-slate-500">{SITE_DESCRIPTION}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">功能模块</h4>
            <ul className="mt-3 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-indigo-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">免责声明</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              服务市场联系方式仅供信息撮合，平台不参与线下交易与资金担保。外链工具由第三方提供，请以官方页面为准。
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
