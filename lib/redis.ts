import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  // 忽略 .env.example 占位符，避免无效请求拖慢响应
  if (url.includes("xxx.upstash.io") || token === "your-token") return null;
  redis = new Redis({ url, token });
  return redis;
}

export async function incrementToolClick(toolId: string) {
  const client = getRedis();
  if (!client) return;
  const key = `tool:clicks:${toolId}`;
  await client.incr(key);
  await client.incr("tool:clicks:pending-sync");
}

export async function getHotToolsFromRedis(limit = 10) {
  const client = getRedis();
  if (!client) return [];
  const keys = await client.keys("tool:clicks:*");
  const toolKeys = keys.filter(
    (k) => k.startsWith("tool:clicks:") && !k.endsWith("pending-sync"),
  );
  const scores: { toolId: string; clicks: number }[] = [];
  for (const key of toolKeys.slice(0, 50)) {
    const clicks = (await client.get<number>(key)) ?? 0;
    const toolId = key.replace("tool:clicks:", "");
    scores.push({ toolId, clicks });
  }
  return scores.sort((a, b) => b.clicks - a.clicks).slice(0, limit);
}
