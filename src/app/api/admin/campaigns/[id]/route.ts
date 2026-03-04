import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { name, discountPercentage, isActive, validUntil } = body;

  const [updated] = await db
    .update(campaigns)
    .set({
      name: String(name),
      discountPercentage: Number(discountPercentage ?? 0),
      isActive: Boolean(isActive),
      validUntil: validUntil ? new Date(validUntil) : null,
    })
    .where(eq(campaigns.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [deleted] = await db
    .delete(campaigns)
    .where(eq(campaigns.id, Number(id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
