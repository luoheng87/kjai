import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { withDbFallback } from "@/lib/data/safe";
import { events } from "@/drizzle/schema";
import type { EventDetail, EventPreview } from "@/lib/data/types";

export async function getUpcomingEvents(limit?: number): Promise<EventPreview[]> {
  if (!db) return [];

  const rows = await withDbFallback(
    () =>
      db!
        .select({
          id: events.id,
          slug: events.slug,
          title: events.title,
          description: events.description,
          location: events.location,
          startsAt: events.startsAt,
        })
        .from(events)
        .where(eq(events.status, "published"))
        .orderBy(desc(events.startsAt)),
    [],
    "getUpcomingEvents",
  );

  return limit ? rows.slice(0, limit) : rows;
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  if (!db) return null;

  const [row] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!row || row.status !== "published") return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    startsAt: row.startsAt,
    externalTicketUrl: row.externalTicketUrl,
    useInternalForm: row.useInternalForm,
  };
}
