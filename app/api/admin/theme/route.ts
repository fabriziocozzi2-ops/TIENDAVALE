import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, ThemeSettings } from "@/lib/server/db";
import { isAdminAuthenticated } from "@/lib/server/adminAuth";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({ theme: db.theme });
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const theme = (await request.json()) as ThemeSettings;
  const db = await readDB();
  db.theme = theme;
  await writeDB(db);
  return NextResponse.json({ theme: db.theme });
}
