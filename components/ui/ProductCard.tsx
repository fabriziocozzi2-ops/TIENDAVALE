"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import ProductImage from "@/components/ui/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleBuy(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, 1);
  }

  return (
    <div className="group">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage
            image={product.images[0]}
            alt={product.name}
            className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.freeShipping && (
              <span className="bg-morelia-badge text-white text-[10px] uppercase tracking-wide px-2 py-1">
                Envío gratis
              </span>
            )}
            {product.discount && (
              <span className="bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-wide px-2 py-1">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <h3 className="text-sm text-morelia-text">{product.name}</h3>
          <div className="mt-1 flex items-center justify-center gap-2">
            {product.originalPrice && (
              <span className="text-xs text-morelia-text-soft line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-medium">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={handleBuy}
        className="mt-3 w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wide py-2 hover:opacity-60 transition-opacity"
      >
        Comprar <ShoppingCart size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
