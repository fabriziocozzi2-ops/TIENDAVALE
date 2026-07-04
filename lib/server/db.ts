import { Coupon, Order, Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { getSupabase } from "@/lib/server/supabase";

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

export async function readDB(): Promise<DB> {
  const supabase = getSupabase();

  const [productsRes, ordersRes, couponsRes, stateRes] = await Promise.all([
    supabase.from("products").select("id, data"),
    supabase.from("orders").select("id, data").order("created_at", { ascending: false }),
    supabase.from("coupons").select("id, data"),
    supabase.from("app_state").select("key, value").in("key", ["theme", "order_seq"]),
  ]);

  if (productsRes.error) throw productsRes.error;
  if (ordersRes.error) throw ordersRes.error;
  if (couponsRes.error) throw couponsRes.error;
  if (stateRes.error) throw stateRes.error;

  let products = (productsRes.data ?? []).map((row) => row.data);
  if (products.length === 0) {
    await supabase
      .from("products")
      .upsert(seedProducts.map((p) => ({ id: p.id, data: p })));
    products = seedProducts;
  }

  const orders = (ordersRes.data ?? []).map((row) => row.data);
  const coupons = (couponsRes.data ?? []).map((row) => row.data);

  const stateMap = new Map((stateRes.data ?? []).map((row) => [row.key, row.value]));

  let theme = stateMap.get("theme") as ThemeSettings | undefined;
  if (!theme) {
    await supabase.from("app_state").upsert({ key: "theme", value: defaultTheme });
    theme = defaultTheme;
  }

  let orderSeq = stateMap.get("order_seq") as number | undefined;
  if (orderSeq === undefined) {
    await supabase.from("app_state").upsert({ key: "order_seq", value: 1000 });
    orderSeq = 1000;
  }

  return { products, orders, coupons, theme, orderSeq };
}

export async function writeDB(db: DB): Promise<void> {
  const supabase = getSupabase();

  async function syncProducts() {
    const rows = db.products.map((p) => ({ id: p.id, data: p }));
    const { data: existing, error } = await supabase.from("products").select("id");
    if (error) throw error;
    const currentIds = new Set(rows.map((r) => r.id));
    const idsToDelete = (existing ?? []).map((r) => r.id).filter((id) => !currentIds.has(id));
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from("products").delete().in("id", idsToDelete);
      if (deleteError) throw deleteError;
    }
    if (rows.length > 0) {
      const { error: upsertError } = await supabase.from("products").upsert(rows);
      if (upsertError) throw upsertError;
    }
  }

  async function syncOrders() {
    const rows = db.orders.map((o) => ({ id: o.id, data: o }));
    const { data: existing, error } = await supabase.from("orders").select("id");
    if (error) throw error;
    const currentIds = new Set(rows.map((r) => r.id));
    const idsToDelete = (existing ?? []).map((r) => r.id).filter((id) => !currentIds.has(id));
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from("orders").delete().in("id", idsToDelete);
      if (deleteError) throw deleteError;
    }
    if (rows.length > 0) {
      const { error: upsertError } = await supabase.from("orders").upsert(rows);
      if (upsertError) throw upsertError;
    }
  }

  async function syncCoupons() {
    const rows = db.coupons.map((c) => ({ id: c.id, data: c }));
    const { data: existing, error } = await supabase.from("coupons").select("id");
    if (error) throw error;
    const currentIds = new Set(rows.map((r) => r.id));
    const idsToDelete = (existing ?? []).map((r) => r.id).filter((id) => !currentIds.has(id));
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from("coupons").delete().in("id", idsToDelete);
      if (deleteError) throw deleteError;
    }
    if (rows.length > 0) {
      const { error: upsertError } = await supabase.from("coupons").upsert(rows);
      if (upsertError) throw upsertError;
    }
  }

  await Promise.all([syncProducts(), syncOrders(), syncCoupons()]);

  await Promise.all([
    supabase.from("app_state").upsert({ key: "theme", value: db.theme }),
    supabase.from("app_state").upsert({ key: "order_seq", value: db.orderSeq }),
  ]);
}
