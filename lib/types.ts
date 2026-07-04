export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
}

export type CustomizationGroupType =
  | "choice"
  | "swatch"
  | "multi-choice"
  | "quantity"
  | "text";

export interface CustomizationChoice {
  id: string;
  label: string;
  priceDelta: number;
  image?: string; // ProductImage key, for "choice" / "multi-choice"
  color?: string; // hex color, for "swatch"
}

export interface CustomizationGroup {
  id: string;
  label: string;
  type: CustomizationGroupType;
  required: boolean;
  helpText?: string;
  choices?: CustomizationChoice[]; // choice / swatch / multi-choice
  maxSelections?: number; // multi-choice
  includedQty?: number; // quantity
  extraUnitPrice?: number; // quantity
  maxQty?: number; // quantity
  placeholder?: string; // text
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
  customization?: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  groupLabel: string;
  valueLabel: string;
  priceDelta: number;
}

export interface CartItem {
  lineId: string;
  productId: number;
  slug: string;
  name: string;
  price: number; // effective unit price, including customization deltas
  image: string;
  qty: number;
  freeShipping: boolean;
  customization?: SelectedCustomization[];
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
