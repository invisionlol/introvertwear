import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  const [category] = await db
    .insert(categories)
    .values({ name: String(name), slug: String(slug) })
    .returning();

  return NextResponse.json(category, { status: 201 });
}
