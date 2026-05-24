import { config } from "dotenv";

config({ path: ".env.local" });
config();

import pg from "pg";
import { pushSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../drizzle/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL 未配置");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  const db = drizzle(pool, { schema });

  console.log("🔄 正在同步数据库表结构...");
  const result = await pushSchema(schema, db as never);

  if (result.hasDataLoss) {
    console.warn("⚠️  检测到可能的数据丢失变更，已自动继续执行");
  }

  if (result.statementsToExecute?.length) {
    await result.apply();
    console.log(`✅ 表结构同步完成，执行了 ${result.statementsToExecute.length} 条 SQL 语句`);
  } else {
    console.log("✅ 数据库已是最新结构，无需变更");
  }

  await pool.end();
}

main().catch((error) => {
  console.error("❌ 同步失败:", error instanceof Error ? error.message : error);
  process.exit(1);
});
