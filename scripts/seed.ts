import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categories, products } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

// ─── Unsplash images (fashion, fit for dark minimal aesthetic) ───────────────
const BASE = "https://images.unsplash.com/photo";

const IMG = {
  blackTee: [
    `${BASE}-1618354691373-d851c5c3a990?w=800&h=1067&fit=crop&q=80`,
    `${BASE}-1521572163474-6864f9cf17ab?w=800&h=1067&fit=crop&q=80`,
  ],
  hoodie: [
    `${BASE}-1556821840-3a63f15732ce?w=800&h=1067&fit=crop&q=80`,
    `${BASE}-1578662996442-48f60103fc96?w=800&h=1067&fit=crop&q=80`,
  ],
  cargo: [
    `${BASE}-1594938298603-c8148c4dae35?w=800&h=1067&fit=crop&q=80`,
    `${BASE}-1542272604-787c3835535d?w=800&h=1067&fit=crop&q=80`,
  ],
  crewneck: [
    `${BASE}-1609873814058-a8928924184a?w=800&h=1067&fit=crop&q=80`,
    `${BASE}-1521223890158-ef6f877c2b62?w=800&h=1067&fit=crop&q=80`,
  ],
  wideLeg: [
    `${BASE}-1539109136881-3be0616acf4b?w=800&h=1067&fit=crop&q=80`,
    `${BASE}-1509631179647-0177331693ae?w=800&h=1067&fit=crop&q=80`,
  ],
};

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log("Creating categories...");
  const inserted = await db
    .insert(categories)
    .values([
      { name: "Tops", slug: "tops" },
      { name: "Bottoms", slug: "bottoms" },
    ])
    .onConflictDoNothing()
    .returning();

  // Re-fetch all categories to get IDs (including pre-existing ones)
  const allCats = await db.select().from(categories);
  const catMap: Record<string, number> = {};
  for (const c of allCats) catMap[c.slug] = c.id;

  console.log(`  ✓ tops: id=${catMap["tops"]}, bottoms: id=${catMap["bottoms"]}`);
  console.log(`  (${inserted.length} newly created)\n`);

  // ── Products ────────────────────────────────────────────────────────────────
  console.log("Creating products...");
  const productData = [
    {
      title: "Quiet Hours Tee",
      description:
        "An oversized heavyweight tee cut for stillness. 100% combed cotton, pre-washed for a lived-in feel. Wear it alone or layered — it asks for nothing.",
      price: 890,
      stock: 30,
      categoryId: catMap["tops"],
      images: IMG.blackTee,
    },
    {
      title: "Recluse Hoodie",
      description:
        "640gsm French terry. A hoodie that means it. Boxy silhouette, dropped shoulders, heavyweight enough to feel like armour on quiet days.",
      price: 1690,
      stock: 20,
      categoryId: catMap["tops"],
      images: IMG.hoodie,
    },
    {
      title: "Solitude Cargo",
      description:
        "Utility meets restraint. Six-pocket cargo in matte black ripstop. Tapered from the knee — structured without trying. For days when you need pockets more than people.",
      price: 1290,
      stock: 15,
      categoryId: catMap["bottoms"],
      images: IMG.cargo,
    },
    {
      title: "Still Crewneck",
      description:
        "Midweight cotton fleece crewneck. No logo. No noise. Just the right weight for the transition from room to street and back again.",
      price: 1390,
      stock: 25,
      categoryId: catMap["tops"],
      images: IMG.crewneck,
    },
    {
      title: "Void Wide Leg",
      description:
        "Wide-leg trouser in matte black twill. High-rise, relaxed through the thigh, clean break at the ankle. The kind of pants that make a room quieter when you walk in.",
      price: 1190,
      stock: 12,
      categoryId: catMap["bottoms"],
      images: IMG.wideLeg,
    },
  ];

  const inserted2 = await db.insert(products).values(productData).returning();

  for (const p of inserted2) {
    console.log(`  ✓ [${p.id}] ${p.title} — ฿${p.price.toLocaleString()}`);
  }

  console.log(`\n✅ Done — ${inserted2.length} products seeded.`);
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
