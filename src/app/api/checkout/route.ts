import { NextRequest, NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
import { getActiveCampaigns, getMaxDiscount, applyDiscount } from "@/lib/data";

type IncomingItem = { id: number; quantity: number };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, items } = body as { email: string; items: IncomingItem[] };

  if (!email || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "email and items are required" }, { status: 400 });
  }

  const ids = items.map((i) => i.id);
  const [dbProducts, campaigns] = await Promise.all([
    db.select().from(products).where(inArray(products.id, ids)),
    getActiveCampaigns(),
  ]);

  const discountPct = getMaxDiscount(campaigns);

  // Calculate server-authoritative total
  let totalAmount = 0;
  for (const item of items) {
    const product = dbProducts.find((p) => p.id === item.id);
    if (!product || product.stock <= 0) continue;
    const price = discountPct > 0 ? applyDiscount(product.price, discountPct) : product.price;
    totalAmount += price * item.quantity;
  }

  if (totalAmount === 0) {
    return NextResponse.json({ error: "No valid items in order" }, { status: 400 });
  }

  const [order] = await db
    .insert(orders)
    .values({
      customerEmail: email,
      totalAmount,
      stripeSessionId: null,
      status: "pending",
    })
    .returning();

  return NextResponse.json({ orderId: order.id, total: totalAmount }, { status: 201 });
}
