import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";
import { Coupon } from "@/lib/types";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({ coupons: db.coupons });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Coupon>;
  const db = await readDB();

  const coupon: Coupon = {
    id: crypto.randomUUID(),
    code: (body.code || "").toUpperCase().trim(),
    type: body.type || "percentage",
    value: body.value ?? 0,
    maxUses: body.maxUses ?? null,
    uses: 0,
    active: true,
  };

  if (!coupon.code) {
    return NextResponse.json({ error: "El código es requerido" }, { status: 400 });
  }

  db.coupons.push(coupon);
  await writeDB(db);
  return NextResponse.json({ coupon });
}
