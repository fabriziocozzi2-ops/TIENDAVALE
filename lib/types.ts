export type CategorySlug =
  | "relojes"
  | "bolsos"
  | "cinturones"
  | "billeteras"
  | "estuches";

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  category: CategorySlug;
  freeShipping: boolean;
  images: string[];
  description: string;
  featuredHome?: boolean;
  featuredCategory?: boolean;
  stock: number | null; // null = infinito
  sku?: string;
}

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  freeShipping: boolean;
}

export interface Order {
  id: string;
  number: number;
  date: string;
  customerEmail: string;
  customerName?: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pendiente" | "pagado" | "cancelado";
  paymentMethod?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free-shipping";
  value: number;
  maxUses: number | null;
  uses: number;
  active: boolean;
}

export interface Testimonial {
  id: number;
  text: string;
  name: string;
  photo?: string;
}
