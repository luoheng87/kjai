import { config } from "dotenv";
import { neonConfig } from "@neondatabase/serverless";
import { defineConfig } from "drizzle-kit";
import ws from "ws";

config({ path: ".env.local" });
config();

neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
