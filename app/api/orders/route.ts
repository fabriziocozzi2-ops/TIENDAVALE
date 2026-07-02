import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";
import { CartItem, Order } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, postalCode, items, paymentMethod, customerName } = body as {
    email: string;
    postalCode: string;
    items: CartItem[];
    paymentMethod: string;
    customerName?: string;
  };

  if (!email || !postalCode || !items?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = await readDB();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = items.every((i) => i.freeShipping) ? 0 : 1500;

  const order: Order = {
    id: crypto.randomUUID(),
    number: db.orderSeq + 1,
    date: new Date().toISOString(),
    customerEmail: email,
    customerName,
    postalCode,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "pagado",
    paymentMethod,
  };

  db.orders.unshift(order);
  db.orderSeq += 1;
  await writeDB(db);

  return NextResponse.json({ order });
}

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({ orders: db.orders });
}
