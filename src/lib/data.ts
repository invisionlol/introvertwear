import { db } from "./db";
import { products, categories, campaigns } from "./db/schema";
import { and, desc, eq, gt, isNull, or } from "drizzle-orm";

export async function getNewArrivals(limit = 8) {
  return db.query.products.findMany({
    with: { category: true },
    orderBy: [desc(products.createdAt)],
    limit,
  });
}

export async function getProductsByCategory(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  if (!category) return { category: null, products: [] };

  const prods = await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  });
  return { category, products: prods };
}

export async function getProductById(id: number) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });
}

export async function getActiveCampaigns() {
  const now = new Date();
  return db.select().from(campaigns).where(
    and(
      eq(campaigns.isActive, true),
      or(isNull(campaigns.validUntil), gt(campaigns.validUntil, now))
    )
  );
}

export async function getAllCategories() {
  return db.select().from(categories);
}

export function getMaxDiscount(cams: { discountPercentage: number }[]) {
  if (!cams.length) return 0;
  return Math.max(...cams.map((c) => c.discountPercentage));
}

export function applyDiscount(price: number, pct: number) {
  return Math.round(price * (1 - pct / 100));
}
