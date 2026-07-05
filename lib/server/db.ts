import { Category, Coupon, Order, Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { categories as seedCategories } from "@/lib/data/categories";
import { getSupabase } from "@/lib/server/supabase";

export interface HeroSlideContent {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
}

export interface BannerContent {
  title: string;
  href: string;
  image?: string;
}

export interface TestimonialContent {
  text: string;
  name: string;
  photo?: string;
}

export interface IconInfoItemContent {
  title: string;
  text: string;
}

export interface HomeContent {
  welcome: { text: string };
  slider: { slides: HeroSlideContent[] };
  featured: { title: string };
  mission: { eyebrow: string; quote: string; linkLabel: string; linkHref: string };
  featuredDetail: { productId: number | null };
  banners: BannerContent[];
  testimonials: TestimonialContent[];
  handmade: { title: string; text: string; image?: string };
  iconInfo: IconInfoItemContent[];
  newsletter: { title: string; instagramHandle: string; instagramHref: string };
}

export interface ThemeSettings {
  logoUrl?: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    button: string;
  };
  homepage: {
    sections: { id: string; label: string; visible: boolean }[];
  };
  content: HomeContent;
}

export interface DB {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  categories: Category[];
  theme: ThemeSettings;
  orderSeq: number;
}

const defaultContent: HomeContent = {
  welcome: {
    text: "Nuestra marca tiene una tradición que se transmite hace 3 generaciones. Esto nos permite asegurar y ofrecer la más alta calidad en nuestros productos.",
  },
  slider: {
    slides: [
      {
        title: "Distinción",
        subtitle: "Un toque sofisticado para tus objetos del día a día",
        ctaLabel: "Comprar",
        ctaHref: "/billeteras",
      },
      {
        title: "100% Cuero",
        subtitle: "Todos nuestros productos están confeccionados en cuero ecológico.",
        ctaLabel: "Comprar",
        ctaHref: "/bolsos",
      },
    ],
  },
  featured: { title: "Los más elegidos" },
  mission: {
    eyebrow: "Nuestros productos",
    quote:
      "Nuestra misión es ofrecer objetos de alta calidad que sean completamente libres de productos de origen animal, sin comprometer el estilo ni el respeto por los animales.",
    linkLabel: "Conocer más",
    linkHref: "/nosotros",
  },
  featuredDetail: { productId: null },
  banners: [
    { title: "Inspirate en la nueva colección", href: "/bolsos" },
    { title: "Todos nuestros materiales son eco friendly", href: "/relojes" },
  ],
  testimonials: [
    {
      text: "Como defensor de los derechos de los animales y consciente del impacto ambiental de la industria de la moda, siempre he buscado alternativas éticas y sostenibles. Encontrar esta tienda fue un verdadero hallazgo.",
      name: "Maro",
    },
    {
      text: "La calidad del cuero ecológico superó mis expectativas. Se nota la dedicación artesanal en cada detalle de los productos.",
      name: "Julia",
    },
    {
      text: "Compré la Mochila Austria hace seis meses y sigue como el primer día. El envío fue rapidísimo y la atención excelente.",
      name: "Nicolás",
    },
  ],
  handmade: {
    title: "Handmade",
    text: "Cada objeto es realizado con dedicación para ofrecerte productos de cuero de la más alta calidad.",
  },
  iconInfo: [
    {
      title: "Nosotros",
      text: "Nuestra misión es crear productos de alta calidad que reflejen la artesanía tradicional y el lujo contemporáneo.",
    },
    {
      title: "Locales",
      text: "Tenemos 5 locales alrededor de todo el país, para que todos puedan acceder a nuestros productos.",
    },
    {
      title: "Reciclados",
      text: "Nuestros productos están 100% reciclados, son amables con el medio ambiente y los procesos productivos.",
    },
  ],
  newsletter: {
    title: "Registrate y recibí nuestras ofertas.",
    instagramHandle: "somos.morelia.accesorios",
    instagramHref: "#",
  },
};

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
  content: defaultContent,
};

export async function readDB(): Promise<DB> {
  const supabase = getSupabase();

  const [productsRes, ordersRes, couponsRes, stateRes] = await Promise.all([
    supabase.from("products").select("id, data"),
    supabase.from("orders").select("id, data").order("created_at", { ascending: false }),
    supabase.from("coupons").select("id, data"),
    supabase
      .from("app_state")
      .select("key, value")
      .in("key", ["theme", "order_seq", "categories"]),
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
  } else if (!theme.content) {
    theme = { ...theme, content: defaultContent };
    await supabase.from("app_state").upsert({ key: "theme", value: theme });
  }

  let orderSeq = stateMap.get("order_seq") as number | undefined;
  if (orderSeq === undefined) {
    await supabase.from("app_state").upsert({ key: "order_seq", value: 1000 });
    orderSeq = 1000;
  }

  let categories = stateMap.get("categories") as Category[] | undefined;
  if (!categories) {
    await supabase.from("app_state").upsert({ key: "categories", value: seedCategories });
    categories = seedCategories;
  }

  return { products, orders, coupons, categories, theme, orderSeq };
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
    supabase.from("app_state").upsert({ key: "categories", value: db.categories }),
  ]);
}
