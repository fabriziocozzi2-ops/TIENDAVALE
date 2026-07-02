import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";
import { Product } from "@/lib/types";
import { slugify } from "@/lib/format";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({ products: db.products });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Product>;
  const db = await readDB();

  const nextId = db.products.length
    ? Math.max(...db.products.map((p) => p.id)) + 1
    : 1;

  const slug = body.slug || slugify(body.name || "producto");

  const product: Product = {
    id: nextId,
    name: body.name || "Nuevo producto",
    slug,
    price: body.price ?? 0,
    originalPrice: body.originalPrice ?? null,
    discount: body.discount ?? null,
    category: body.category || "bolsos",
    freeShipping: body.freeShipping ?? false,
    images: body.images?.length ? body.images : [`${body.category || "bolsos"}-1`],
    description: body.description || "",
    featuredHome: body.featuredHome ?? false,
    featuredCategory: body.featuredCategory ?? false,
    stock: body.stock ?? null,
    sku: body.sku || "",
    customization: body.customization ?? [],
  };

  db.products.push(product);
  await writeDB(db);

  return NextResponse.json({ product });
}
