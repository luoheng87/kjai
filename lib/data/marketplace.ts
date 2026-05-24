import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { marketplaceListings, users } from "@/drizzle/schema";
import type { ListingDetail, ListingPreview } from "@/lib/data/types";

export async function getActiveListings(): Promise<ListingPreview[]> {
  if (!db) return [];

  const rows = await db
    .select({
      id: marketplaceListings.id,
      type: marketplaceListings.type,
      title: marketplaceListings.title,
      description: marketplaceListings.description,
      budget: marketplaceListings.budget,
      deliveryTime: marketplaceListings.deliveryTime,
      createdAt: marketplaceListings.createdAt,
      authorName: users.name,
    })
    .from(marketplaceListings)
    .leftJoin(users, eq(marketplaceListings.userId, users.id))
    .where(eq(marketplaceListings.status, "active"))
    .orderBy(desc(marketplaceListings.createdAt));

  return rows;
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  if (!db) return null;

  const [row] = await db
    .select({
      id: marketplaceListings.id,
      type: marketplaceListings.type,
      title: marketplaceListings.title,
      description: marketplaceListings.description,
      budget: marketplaceListings.budget,
      deliveryTime: marketplaceListings.deliveryTime,
      contactWechat: marketplaceListings.contactWechat,
      contactWhatsapp: marketplaceListings.contactWhatsapp,
      contactTelegram: marketplaceListings.contactTelegram,
      createdAt: marketplaceListings.createdAt,
      authorName: users.name,
      status: marketplaceListings.status,
    })
    .from(marketplaceListings)
    .leftJoin(users, eq(marketplaceListings.userId, users.id))
    .where(eq(marketplaceListings.id, id))
    .limit(1);

  if (!row || row.status !== "active") return null;
  return row;
}
