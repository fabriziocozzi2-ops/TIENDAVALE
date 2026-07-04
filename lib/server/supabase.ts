import { createClient } from "@supabase/supabase-js";
import { Coupon, Order, Product } from "@/lib/types";

interface JsonTable<IdType, T> {
  Row: { id: IdType; data: T };
  Insert: { id: IdType; data: T };
  Update: { id?: IdType; data?: T };
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      products: JsonTable<number, Product>;
      orders: JsonTable<string, Order>;
      coupons: JsonTable<string, Coupon>;
      app_state: {
        Row: { key: string; value: unknown; updated_at: string };
        Insert: { key: string; value: unknown };
        Update: { key?: string; value?: unknown };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  client = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
