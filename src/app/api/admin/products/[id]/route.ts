import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, price, stock, categoryId, images } = body;

  const [updated] = await db
    .update(products)
    .set({
      title: String(title),
      description: description ? String(description) : null,
      price: Number(price),
      stock: Number(stock ?? 0),
      categoryId: categoryId ? Number(categoryId) : null,
      images: Array.isArray(images) ? images.filter(Boolean) : [],
    })
    .where(eq(products.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, Number(id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
