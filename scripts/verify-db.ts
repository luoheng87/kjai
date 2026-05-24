import { config } from "dotenv";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../drizzle/schema";

config({ path: ".env.local" });
config();

const { users, categories, aiTools, forumPosts, articles, events } = schema;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("NO DATABASE_URL");
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });

  const [[userCount], [categoryCount], [toolCount], [postCount], [articleCount], [eventCount]] =
    await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(categories),
      db.select({ count: count() }).from(aiTools),
      db.select({ count: count() }).from(forumPosts),
      db.select({ count: count() }).from(articles),
      db.select({ count: count() }).from(events),
    ]);

  console.log("✅ 数据库对接验证通过");
  console.log(`   用户: ${userCount.count}`);
  console.log(`   分类: ${categoryCount.count}`);
  console.log(`   工具: ${toolCount.count}`);
  console.log(`   帖子: ${postCount.count}`);
  console.log(`   资讯: ${articleCount.count}`);
  console.log(`   活动: ${eventCount.count}`);
}

main().catch((error) => {
  console.error("❌ 验证失败:", error instanceof Error ? error.message : error);
  process.exit(1);
});
