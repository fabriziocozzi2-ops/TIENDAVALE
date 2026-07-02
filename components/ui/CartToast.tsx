"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";

export default function CartToast() {
  const toast = useCartStore((s) => s.toast);
  const hideToast = useCartStore((s) => s.hideToast);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  if (!toast.visible || !toast.item) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] bg-white shadow-lg border w-72 p-4 flex gap-3 animate-in">
      <ProductImage
        image={toast.item.image}
        alt={toast.item.name}
        className="w-14 h-14 shrink-0"
      />
      <div className="flex-1">
        <p className="text-xs text-morelia-text-soft">
          {toast.item.qty}x {formatPrice(toast.item.price)}
        </p>
        <p className="text-sm font-medium mt-1">¡Agregado al carrito!</p>
      </div>
      <button onClick={hideToast} aria-label="Cerrar notificación">
        <X size={16} />
      </button>
    </div>
  );
}
