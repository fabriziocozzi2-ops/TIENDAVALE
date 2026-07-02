import { promises as fs, constants as fsConstants } from "fs";
import os from "os";
import path from "path";
import { Coupon, Order, Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";

export interface ThemeSettings {
  colors: {
    background: string;
    text: string;
    accent: string;
    button: string;
  };
  homepage: {
    sections: { id: string; label: string; visible: boolean }[];
  };
}

export interface DB {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  theme: ThemeSettings;
  orderSeq: number;
}

const defaultTheme: ThemeSettings = {
  colors: {
    background: "#FFFFFF",
    text: "#1A1A1A",
    accent: "#2D3A35",
    button: "#1C2B27",
  },
  homepage: {
    sections: [
      { id: "welcome", label: "Mensaje de bienvenida", visible: true },
      { id: "slider", label: "Carrusel de imágenes", visible: true },
      { id: "featured", label: "Productos destacados", visible: true },
      { id: "categories", label: "Categorías principales", visible: true },
      { id: "mission", label: "Mensaje institucional", visible: true },
      { id: "featuredDetail", label: "Producto principal", visible: true },
      { id: "banners", label: "Banners promocionales", visible: true },
      { id: "testimonials", label: "Testimonios", visible: true },
      { id: "handmade", label: "Handmade", visible: true },
      { id: "iconInfo", label: "Información de envío", visible: true },
      { id: "newsletter", label: "Newsletter e Instagram", visible: true },
    ],
  },
};

// Serverless platforms (e.g. Vercel) ship a read-only filesystem except
// for os.tmpdir(). Resolve to a writable location so reads/writes don't
// throw EROFS in production; falls back to the project's /data folder
// for local dev and traditional Node servers.
let resolvedDbPath: string | null = null;

async function resolveDbPath(): Promise<string> {
  if (resolvedDbPath) return resolvedDbPath;

  const primary = path.join(process.cwd(), "data", "db.json");
  try {
    await fs.mkdir(path.dirname(primary), { recursive: true });
    await fs.access(path.dirname(primary), fsConstants.W_OK);
    resolvedDbPath = primary;
  } catch {
    resolvedDbPath = path.join(os.tmpdir(), "morelia-db.json");
  }
  return resolvedDbPath;
}

async function ensureDB(dbPath: string): Promise<void> {
  try {
    await fs.access(dbPath);
  } catch {
    const initial: DB = {
      products: seedProducts,
      orders: [],
      coupons: [],
      theme: defaultTheme,
      orderSeq: 1000,
    };
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(initial, null, 2));
  }
}

export async function readDB(): Promise<DB> {
  const dbPath = await resolveDbPath();
  await ensureDB(dbPath);
  const raw = await fs.readFile(dbPath, "utf-8");
  const db = JSON.parse(raw) as DB;
  if (!db.coupons) db.coupons = [];
  return db;
}

export async function writeDB(db: DB): Promise<void> {
  const dbPath = await resolveDbPath();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}
