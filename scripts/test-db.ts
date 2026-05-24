import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("NO DATABASE_URL");
  process.exit(1);
}

console.log("URL host:", new URL(url.replace("postgresql://", "http://")).host);

const sql = neon(url);

async function main() {
  try {
    const result = await sql`SELECT 1 as ok`;
    console.log("HTTP connection OK:", result);
  } catch (error) {
    console.error("HTTP connection FAIL:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
