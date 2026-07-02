"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import ProductImage from "@/components/ui/ProductImage";

export default function FeaturedProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="py-16 px-4 max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {product.images.map((img, i) => (
            <button key={img} onClick={() => setActiveImage(i)}>
              <ProductImage
                image={img}
                alt={product.name}
                className={`w-16 h-16 border ${
                  activeImage === i ? "border-morelia-text" : "border-transparent"
                }`}
              />
            </button>
          ))}
        </div>
        <ProductImage
          image={product.images[activeImage]}
          alt={product.name}
          className="flex-1 aspect-square"
        />
      </div>

      <div className="flex flex-col justify-center max-w-md">
        <Link href={`/productos/${product.slug}`}>
          <h2 className="font-serif text-2xl mb-2 hover:opacity-70 transition-opacity">
            {product.name}
          </h2>
        </Link>
        <p className="text-lg font-medium mb-2">{formatPrice(product.price)}</p>
        {product.freeShipping && (
          <span className="inline-block bg-morelia-badge text-white text-[10px] uppercase tracking-wide px-2 py-1 w-fit mb-6">
            Envío gratis
          </span>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-morelia-text/20">
            <button
              className="px-3 py-2"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Restar"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 text-sm">{qty}</span>
            <button
              className="px-3 py-2"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Sumar"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => addItem(product, qty)}
            className="flex-1 bg-[var(--color-button)] text-white py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            Agregar al carrito
          </button>
        </div>

        <p className={`text-sm text-morelia-text-soft leading-relaxed ${!expanded && "line-clamp-3"}`}>
          {product.description}
        </p>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-sm underline underline-offset-4 mt-2 w-fit"
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </section>
  );
}
