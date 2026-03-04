import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// ─── Products ────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  // Store price in smallest unit (e.g. satang / cents); display by dividing by 100
  price: integer("price").notNull(), // e.g. 129900 = ฿1,299.00
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  // Array of image URLs stored as JSON text (Supabase Storage or external CDN)
  images: text("images").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// ─── Campaigns (Promotions) ───────────────────────────────────────────────────

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  // e.g. 20 = 20% off
  discountPercentage: integer("discount_percentage").notNull().default(0),
  isActive: boolean("is_active").notNull().default(false),
  validUntil: timestamp("valid_until", { withTimezone: true }),
});

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerEmail: varchar("customer_email", { length: 254 }).notNull(),
  // Total in smallest unit, matching products.price convention
  totalAmount: integer("total_amount").notNull(),
  stripeSessionId: varchar("stripe_session_id", { length: 300 }),
  // 'pending' | 'paid' | 'cancelled'
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
