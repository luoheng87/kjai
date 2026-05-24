import Link from "next/link";
import { SiteContainer } from "@/components/layout/site-container";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-300/60 bg-[#dae0e6]">
      <SiteContainer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-6 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{SITE_NAME}</span>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="hover:underline">
            {item.label}
          </Link>
        ))}
        <span>© {new Date().getFullYear()}</span>
      </SiteContainer>
    </footer>
  );
}
