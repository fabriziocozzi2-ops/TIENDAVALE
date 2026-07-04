import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await request.json();
  const db = await readDB();
  const index = db.categories.findIndex((c) => c.slug === params.slug);
  if (index === -1) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  db.categories[index] = { ...db.categories[index], ...body, slug: db.categories[index].slug };
  await writeDB(db);
  return NextResponse.json({ category: db.categories[index] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  db.categories = db.categories.filter((c) => c.slug !== params.slug);
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
