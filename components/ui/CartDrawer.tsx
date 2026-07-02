"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const [postalCode, setPostalCode] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-serif text-lg">Carrito de compras</h2>
          <button onClick={closeDrawer} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-morelia-text-soft text-center mt-12">
              Tu carrito está vacío.
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4">
                  <ProductImage
                    image={item.image}
                    alt={item.name}
                    className="w-20 h-20 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        className="text-xs text-morelia-error hover:underline"
                      >
                        Borrar
                      </button>
                    </div>
                    {item.customization && item.customization.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {item.customization.map((c) => (
                          <li key={c.groupId} className="text-xs text-morelia-text-soft">
                            {c.groupLabel}: {c.valueLabel}
                            {c.priceDelta > 0 && ` (+${formatPrice(c.priceDelta)})`}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.freeShipping && (
                      <p className="text-xs text-[var(--color-accent)] mt-1">
                        Envío gratis
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex items-center border border-morelia-text/20">
                        <button
                          className="px-2 py-1"
                          onClick={() => updateQty(item.lineId, item.qty - 1)}
                          aria-label="Restar"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button
                          className="px-2 py-1"
                          onClick={() => updateQty(item.lineId, item.qty + 1)}
                          aria-label="Sumar"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-6 py-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal (sin envío)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            <div>
              <p className="text-sm mb-2">Medios de envío</p>
              <div className="flex gap-2">
                <input
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                    setShippingCalculated(false);
                  }}
                  placeholder="Tu código postal"
                  className="flex-1 border border-morelia-text/20 px-3 py-2 text-sm focus:outline-none"
                />
                <button
                  onClick={() => setShippingCalculated(true)}
                  className="border border-morelia-text/40 px-4 text-sm hover:bg-morelia-bg-alt transition-colors"
                >
                  Calcular
                </button>
              </div>
              <button className="text-xs underline mt-2 text-morelia-text-soft">
                No sé mi código postal
              </button>
              {shippingCalculated && (
                <p className="text-xs text-[var(--color-accent)] mt-2">
                  Envío estándar disponible: 3 a 5 días hábiles.
                </p>
              )}
            </div>

            <div className="flex justify-between text-base font-medium pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block text-center bg-[var(--color-button)] text-white py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Iniciar Compra
            </Link>
            <button
              onClick={closeDrawer}
              className="block w-full text-center text-sm underline text-morelia-text-soft"
            >
              Ver más productos
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
