import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDb } from "@/lib/db";
import { eventRegistrations } from "@/drizzle/schema";

const schema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/events?error=invalid", request.url));
  }

  if (process.env.DATABASE_URL) {
    await requireDb().insert(eventRegistrations).values({
      eventId: parsed.data.eventId,
      name: parsed.data.name,
      phone: parsed.data.phone,
      company: parsed.data.company,
    });
  }

  return NextResponse.redirect(new URL("/events?registered=1", request.url));
}
