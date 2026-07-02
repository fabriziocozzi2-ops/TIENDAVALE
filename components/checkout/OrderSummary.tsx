"use client";

import { useState } from "react";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";

export default function OrderSummary({
  items,
  shipping = 0,
}: {
  items: CartItem[];
  shipping?: number;
}) {
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="bg-morelia-bg-alt p-6">
      <ul className="space-y-4 mb-6">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-3 items-center">
            <ProductImage image={item.image} alt={item.name} className="w-14 h-14 shrink-0" />
            <div className="flex-1 text-sm">
              <p>{item.name}</p>
              <p className="text-morelia-text-soft">× {item.qty}</p>
            </div>
            <span className="text-sm font-medium">
              {formatPrice(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-base font-medium pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(subtotal + shipping)}</span>
        </div>
      </div>

      <div className="mt-4">
        {couponOpen ? (
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Código de cupón"
              className="flex-1 border border-morelia-text/20 px-3 py-2 text-sm focus:outline-none"
            />
            <button className="border border-morelia-text/40 px-3 text-sm">
              Aplicar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCouponOpen(true)}
            className="text-sm underline text-morelia-text-soft"
          >
            Agregar cupón de descuento
          </button>
        )}
      </div>
    </div>
  );
}
