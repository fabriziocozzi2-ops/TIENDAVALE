import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  db.coupons = db.coupons.filter((c) => c.id !== params.id);
  await writeDB(db);
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await request.json();
  const db = await readDB();
  const index = db.coupons.findIndex((c) => c.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  db.coupons[index] = { ...db.coupons[index], ...body };
  await writeDB(db);
  return NextResponse.json({ coupon: db.coupons[index] });
}
