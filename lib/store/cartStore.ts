"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/lib/types";

interface ToastState {
  visible: boolean;
  item: CartItem | null;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  toast: ToastState;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  hideToast: () => void;
  clearCart: () => void;
  hasProduct: (productId: number) => boolean;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      toast: { visible: false, item: null },

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          let items: CartItem[];
          let toastItem: CartItem;
          if (existing) {
            items = state.items.map((i) =>
              i.productId === product.id ? { ...i, qty: i.qty + qty } : i
            );
            toastItem = { ...existing, qty: existing.qty + qty };
          } else {
            const newItem: CartItem = {
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

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty } : i
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
