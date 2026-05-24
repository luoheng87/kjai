import { config } from "dotenv";

config({ path: ".env.local" });
config();
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../drizzle/schema";
import { DIRECTORY_CATEGORIES } from "../lib/constants";

const {
  users,
  categories,
  aiTools,
  sensitiveWords,
  marketplaceListings,
  forumPosts,
  articles,
  events,
} = schema;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ 请先在 .env.local 中配置 DATABASE_URL");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log("🌱 开始初始化数据...\n");

  // 管理员账号
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kjai.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";

  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (!existingAdmin) {
    await db.insert(users).values({
      name: "管理员",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "admin",
    });
    console.log(`✅ 管理员已创建: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`⏭️  管理员已存在: ${adminEmail}`);
  }

  // 测试厂商账号
  const vendorEmail = "vendor@kjai.com";
  const [existingVendor] = await db
    .select()
    .from(users)
    .where(eq(users.email, vendorEmail))
    .limit(1);

  if (!existingVendor) {
    await db.insert(users).values({
      name: "测试厂商",
      email: vendorEmail,
      passwordHash: await bcrypt.hash("vendor123456", 10),
      role: "vendor",
    });
    console.log("✅ 测试厂商已创建: vendor@kjai.com / vendor123456");
  }

  // 分类
  const categoryMap: Record<string, string> = {};
  for (const [index, cat] of DIRECTORY_CATEGORIES.entries()) {
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, cat.slug))
      .limit(1);

    if (existing) {
      categoryMap[cat.slug] = existing.id;
    } else {
      const [inserted] = await db
        .insert(categories)
        .values({ slug: cat.slug, name: cat.name, sortOrder: index })
        .returning({ id: categories.id });
      categoryMap[cat.slug] = inserted.id;
    }
  }
  console.log(`✅ 分类已同步: ${DIRECTORY_CATEGORIES.length} 个`);

  // AI 工具
  const tools = [
    {
      slug: "listing-genius",
      name: "ListingGenius",
      tagline: "Amazon Listing 一键生成与优化",
      categorySlug: "listing",
      websiteUrl: "https://example.com/listing-genius",
      affiliateSuffix: "ref=kjai",
      promoCode: "KJAI20",
      rating: 4.8,
      clickCount: 1280,
      likeCount: 342,
      isFeatured: true,
    },
    {
      slug: "crossborder-translate",
      name: "CrossBorder Translate",
      tagline: "多语种商品描述与客服话术翻译",
      categorySlug: "translation",
      websiteUrl: "https://example.com/translate",
      affiliateSuffix: "utm=kjai",
      rating: 4.6,
      clickCount: 980,
      likeCount: 210,
      isFeatured: true,
    },
    {
      slug: "ai-model-studio",
      name: "AI Model Studio",
      tagline: "虚拟模特换装，降低拍摄成本",
      categorySlug: "model",
      websiteUrl: "https://example.com/model",
      affiliateSuffix: "ref=kjai",
      promoCode: "VIP15",
      rating: 4.7,
      clickCount: 756,
      likeCount: 189,
      isFeatured: false,
    },
    {
      slug: "product-scout-ai",
      name: "ProductScout AI",
      tagline: "TikTok/亚马逊选品趋势分析",
      categorySlug: "product-research",
      websiteUrl: "https://example.com/scout",
      rating: 4.5,
      clickCount: 654,
      likeCount: 156,
      isFeatured: false,
    },
    {
      slug: "smart-cs-bot",
      name: "SmartCS Bot",
      tagline: "7×24 多平台智能客服机器人",
      categorySlug: "customer-service",
      websiteUrl: "https://example.com/cs",
      affiliateSuffix: "partner=kjai",
      promoCode: "KJAI8",
      rating: 4.4,
      clickCount: 432,
      likeCount: 98,
      isFeatured: false,
    },
    {
      slug: "pending-tool-demo",
      name: "PendingTool Demo",
      tagline: "待审核测试工具（用于后台审核演示）",
      categorySlug: "ads",
      websiteUrl: "https://example.com/pending",
      rating: 0,
      clickCount: 0,
      likeCount: 0,
      isFeatured: false,
      status: "pending" as const,
    },
  ];

  for (const tool of tools) {
    const [existing] = await db
      .select()
      .from(aiTools)
      .where(eq(aiTools.slug, tool.slug))
      .limit(1);

    if (existing) continue;

    const { categorySlug, status, ...rest } = tool;
    await db.insert(aiTools).values({
      ...rest,
      categoryId: categoryMap[categorySlug],
      status: status ?? "approved",
      description: rest.tagline,
    });
  }
  console.log(`✅ AI 工具已同步: ${tools.length} 个（含 1 个待审核）`);

  // 敏感词
  const words = ["赌博", "色情", "诈骗", "刷单"];
  for (const word of words) {
    const [existing] = await db
      .select()
      .from(sensitiveWords)
      .where(eq(sensitiveWords.word, word))
      .limit(1);
    if (!existing) {
      await db.insert(sensitiveWords).values({ word });
    }
  }
  console.log(`✅ 敏感词已同步: ${words.length} 个`);

  // 获取管理员 ID 用于关联数据
  const [admin] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  const adminId = admin?.id;

  if (adminId) {
    const [existingListing] = await db.select().from(marketplaceListings).limit(1);
    if (!existingListing) {
      await db.insert(marketplaceListings).values([
        {
          userId: adminId,
          type: "demand",
          title: "寻找 Amazon Listing 优化服务商",
          description: "月销 50 万美金的家居类目，需要专业 Listing 优化。",
          budget: "5000-10000 元",
          deliveryTime: "2 周内",
          contactWechat: "demo_wechat",
          status: "active",
        },
        {
          userId: adminId,
          type: "service",
          title: "TikTok 短视频 AI 脚本批量生成",
          description: "日产能 50 条脚本，支持中英双语。",
          budget: "500 元/10 条",
          deliveryTime: "24 小时",
          contactWechat: "service_wechat",
          status: "active",
        },
      ]);
      console.log("✅ 服务市场示例已创建");
    }

    const [existingPost] = await db.select().from(forumPosts).limit(1);
    if (!existingPost) {
      await db.insert(forumPosts).values({
        authorId: adminId,
        title: "独立站用 AI 做 SEO，流量涨了 3 倍",
        content: "分享我们团队过去 3 个月的实操经验...",
        tags: "独立站,SEO,AI写作",
        likeCount: 45,
        commentCount: 12,
        status: "published",
      });
      console.log("✅ 论坛示例帖子已创建");
    }

    const [existingArticle] = await db.select().from(articles).limit(1);
    if (!existingArticle) {
      await db.insert(articles).values([
        {
          authorId: adminId,
          title: "2026 年 TikTok 跨境卖家必装 AI 工具清单",
          slug: "tiktok-ai-tools-2026",
          excerpt: "从选品、脚本生成到客服自动化，覆盖 TikTok Shop 全链路。",
          content: "# TikTok AI 工具清单\n\n完整内容...",
          isPremium: false,
          publishedAt: new Date(),
        },
        {
          authorId: adminId,
          title: "深度评测：AI 如何重塑 Amazon Listing 工作流",
          slug: "amazon-listing-ai-deep-dive",
          excerpt: "对比 12 款 Listing 工具的真实 ROI。",
          content: "# 深度评测\n\n完整付费内容...",
          isPremium: true,
          publishedAt: new Date(),
        },
      ]);
      console.log("✅ 资讯示例文章已创建");
    }

    const [existingEvent] = await db.select().from(events).limit(1);
    if (!existingEvent) {
      await db.insert(events).values([
        {
          title: "跨境 AI 出海峰会 · 深圳站",
          slug: "crossborder-ai-summit",
          description: "汇聚 20+ AI 厂商与 500+ 跨境卖家，探讨 AI 降本增效实践。",
          location: "深圳 · 南山",
          startsAt: new Date("2026-06-15T09:00:00"),
          externalTicketUrl: "https://example.com/tickets",
          useInternalForm: false,
          status: "published",
        },
        {
          title: "TikTok 直播 AI 工具实操工作坊",
          slug: "tiktok-live-workshop",
          description: "线上直播教学，报名后人工联系确认席位。",
          location: "线上",
          startsAt: new Date("2026-06-22T14:00:00"),
          useInternalForm: true,
          status: "published",
        },
      ]);
      console.log("✅ 活动示例已创建");
    }
  }

  console.log("\n🎉 数据初始化完成！");
  console.log("\n登录信息：");
  console.log(`  管理员: ${adminEmail} / ${adminPassword}`);
  console.log("  厂商:   vendor@kjai.com / vendor123456");
}

main().catch((err) => {
  console.error("Seed 失败:", err);
  process.exit(1);
});
