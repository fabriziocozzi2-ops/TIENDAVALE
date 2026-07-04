import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";
import { Category } from "@/lib/types";
import { slugify } from "@/lib/format";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({ categories: db.categories });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Category>;
  if (!body.name) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const db = await readDB();
  const slug = body.slug || slugify(body.name);

  if (db.categories.some((c) => c.slug === slug)) {
    return NextResponse.json({ error: "Ya existe una categoría con ese slug" }, { status: 400 });
  }

  const category: Category = {
    slug,
    name: body.name,
    image: body.image || slug,
  };

  db.categories.push(category);
  await writeDB(db);

  return NextResponse.json({ category });
}
