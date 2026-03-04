import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const rows = await db.query.products.findMany({
    with: { category: true },
    orderBy: [desc(products.createdAt)],
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, price, stock, categoryId, images } = body;

  if (!title || price == null) {
    return NextResponse.json({ error: "title and price are required" }, { status: 400 });
  }

  const [product] = await db
    .insert(products)
    .values({
      title: String(title),
      description: description ? String(description) : null,
      price: Number(price),         // stored in baht (integer)
      stock: Number(stock ?? 0),
      categoryId: categoryId ? Number(categoryId) : null,
      images: Array.isArray(images) ? images.filter(Boolean) : [],
    })
    .returning();

  return NextResponse.json(product, { status: 201 });
}
