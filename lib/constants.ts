export const SITE_NAME = "跨境AI圈";
export const SITE_DESCRIPTION =
  "跨境出海行业的一站式 AI 赋能平台 — 工具导航、应用商店、服务撮合、社区论坛";

export const NAV_ITEMS = [
  { href: "/directory", label: "AI 导航", description: "精选跨境 AI 工具" },
  { href: "/hub", label: "工具商店", description: "厂商上架与优惠" },
  { href: "/marketplace", label: "服务市场", description: "需求与服务撮合" },
  { href: "/community", label: "论坛", description: "出海人交流社区" },
  { href: "/media", label: "资讯", description: "快讯与深度报告" },
  { href: "/events", label: "活动", description: "沙龙与直播" },
] as const;

export const DIRECTORY_CATEGORIES = [
  { slug: "product-research", name: "选品调研", icon: "Search" },
  { slug: "listing", name: "Listing 优化", icon: "FileText" },
  { slug: "translation", name: "翻译本地化", icon: "Languages" },
  { slug: "model", name: "AI 模特", icon: "User" },
  { slug: "customer-service", name: "智能客服", icon: "MessageCircle" },
  { slug: "ads", name: "广告投放", icon: "Megaphone" },
  { slug: "logistics", name: "物流供应链", icon: "Truck" },
  { slug: "analytics", name: "数据分析", icon: "BarChart3" },
] as const;

export const USER_ROLES = {
  USER: "user",
  VIP: "vip",
  VENDOR: "vendor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const FREE_CONTACT_VIEWS_PER_DAY = 3;
export const ARTICLE_PREVIEW_RATIO = 0.2;
export const ISR_REVALIDATE_SECONDS = 3600;
