import { eq } from "drizzle-orm";
import { db, requireDb } from "@/lib/db";
import { moderationQueue, sensitiveWords } from "@/drizzle/schema";

export async function loadSensitiveWords(): Promise<string[]> {
  if (!db) return ["赌博", "色情", "诈骗", "刷单"];
  const rows = await db.select({ word: sensitiveWords.word }).from(sensitiveWords);
  return rows.map((r) => r.word);
}

export function containsSensitiveWord(
  text: string,
  words: string[],
): string | null {
  const lower = text.toLowerCase();
  for (const word of words) {
    if (lower.includes(word.toLowerCase())) return word;
  }
  return null;
}

export async function moderateContent(
  contentType: string,
  contentId: string,
  content: string,
): Promise<{ allowed: boolean; matchedWord?: string }> {
  const words = await loadSensitiveWords();
  const matched = containsSensitiveWord(content, words);

  if (!matched) return { allowed: true };

  if (db) {
    await requireDb().insert(moderationQueue).values({
      contentType,
      contentId,
      content: content.slice(0, 500),
      reason: `命中敏感词: ${matched}`,
      status: "pending",
    });
  }

  return { allowed: false, matchedWord: matched };
}
