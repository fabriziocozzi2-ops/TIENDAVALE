"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, SelectedCustomization } from "@/lib/types";

interface ToastState {
  visible: boolean;
  item: CartItem | null;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  toast: ToastState;
  addItem: (product: Product, qty?: number) => void;
  addCustomizedItem: (
    product: Product,
    unitPrice: number,
    qty: number,
    customization: SelectedCustomization[]
  ) => void;
  removeItem: (lineId: string) => void;
  updateQty: (lineId: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  hideToast: () => void;
  clearCart: () => void;
  hasProduct: (productId: number) => boolean;
  totalItems: () => number;
  subtotal: () => number;
}

function makeLineId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `line-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      toast: { visible: false, item: null },

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && !i.customization
          );
          let items: CartItem[];
          let toastItem: CartItem;
          if (existing) {
            items = state.items.map((i) =>
              i.lineId === existing.lineId ? { ...i, qty: i.qty + qty } : i
            );
            toastItem = { ...existing, qty: existing.qty + qty };
          } else {
            const newItem: CartItem = {
              lineId: `p-${product.id}`,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              qty,
              freeShipping: product.freeShipping,
            };
            items = [...state.items, newItem];
            toastItem = newItem;
          }
          return {
            items,
            toast: { visible: true, item: toastItem },
          };
        });
      },

      addCustomizedItem: (product, unitPrice, qty, customization) => {
        set((state) => {
          const newItem: CartItem = {
            lineId: makeLineId(),
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: unitPrice,
            image: product.images[0],
            qty,
            freeShipping: product.freeShipping,
            customization,
          };
          return {
            items: [...state.items, newItem],
            toast: { visible: true, item: newItem },
          };
        });
      },

      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        }));
      },

      updateQty: (lineId, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.lineId === lineId ? { ...i, qty } : i
          ),
        }));
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
      clearCart: () => set({ items: [] }),
      hasProduct: (productId) => !!get().items.find((i) => i.productId === productId),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "morelia-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
