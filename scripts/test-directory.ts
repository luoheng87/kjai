import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { getApprovedTools } from "../lib/data/tools";

async function main() {
  try {
    const tools = await getApprovedTools();
    console.log("OK tools:", tools.length);
  } catch (error) {
    console.error("FAIL:", error);
    process.exit(1);
  }
}

main();
