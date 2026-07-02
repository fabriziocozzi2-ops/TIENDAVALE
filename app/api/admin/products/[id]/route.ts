import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";
import { Product } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  const product = db.products.find((p) => p.id === Number(params.id));
  if (!product) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Product>;
  const db = await readDB();
  const index = db.products.findIndex((p) => p.id === Number(params.id));
  if (index === -1) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  db.products[index] = { ...db.products[index], ...body, id: db.products[index].id };
  await writeDB(db);
  return NextResponse.json({ product: db.products[index] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  db.products = db.products.filter((p) => p.id !== Number(params.id));
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
