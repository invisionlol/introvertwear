import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(campaigns)
    .orderBy(desc(campaigns.id));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, discountPercentage, isActive, validUntil } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const [campaign] = await db
    .insert(campaigns)
    .values({
      name: String(name),
      discountPercentage: Number(discountPercentage ?? 0),
      isActive: Boolean(isActive),
      validUntil: validUntil ? new Date(validUntil) : null,
    })
    .returning();

  return NextResponse.json(campaign, { status: 201 });
}
