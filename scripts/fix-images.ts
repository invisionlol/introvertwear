import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1067&q=80`;

// Verified working Unsplash fashion photo IDs
const IMAGES: Record<number, string[]> = {
  1: [ // Quiet Hours Tee
    U("1529139574466-a303027c1d8b"),
    U("1503341504253-dff4815485f1"),
  ],
  2: [ // Recluse Hoodie
    U("1483985988355-763728e1935b"),
    U("1515886657613-9f3515b0c78f"),
  ],
  3: [ // Solitude Cargo
    U("1490481651871-ab68de25d43d"),
    U("1469334031218-e382a71b716b"),
  ],
  4: [ // Still Crewneck
    U("1529665253569-6d01c0eaf7b6"),
    U("1548036328-c9fa89d128fa"),
  ],
  5: [ // Void Wide Leg
    U("1539109136881-3be0616acf4b"),
    U("1524504388940-b1c1722653e1"),
  ],
};

async function fix() {
  console.log("🔧 Fixing product images...\n");

  for (const [id, images] of Object.entries(IMAGES)) {
    const [updated] = await db
      .update(products)
      .set({ images })
      .where(eq(products.id, Number(id)))
      .returning({ id: products.id, title: products.title });

    if (updated) {
      console.log(`  ✓ [${updated.id}] ${updated.title}`);
    }
  }

  console.log("\n✅ Images updated.");
  await pool.end();
}

fix().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
