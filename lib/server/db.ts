import { promises as fs } from "fs";
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

const DB_PATH = path.join(process.cwd(), "data", "db.json");

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

async function ensureDB(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initial: DB = {
      products: seedProducts,
      orders: [],
      coupons: [],
      theme: defaultTheme,
      orderSeq: 1000,
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

export async function readDB(): Promise<DB> {
  await ensureDB();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  const db = JSON.parse(raw) as DB;
  if (!db.coupons) db.coupons = [];
  return db;
}

export async function writeDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
