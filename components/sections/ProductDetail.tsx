"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import ProductImage from "@/components/ui/ProductImage";
import ProductCard from "@/components/ui/ProductCard";
import CustomizationForm from "@/components/ui/CustomizationForm";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [variantImage, setVariantImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const hasProduct = useCartStore((s) => s.hasProduct(product.id));
  const isCustomizable = !!product.customization?.length;

  function selectThumbnail(index: number) {
    setActiveImage(index);
    setVariantImage(null);
  }

  return (
    <>
      <section className="max-w-8xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button key={img} onClick={() => selectThumbnail(i)}>
                <ProductImage
                  image={img}
                  alt={product.name}
                  className={`w-16 h-16 border ${
                    !variantImage && activeImage === i
                      ? "border-morelia-text"
                      : "border-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <ProductImage
              image={variantImage || product.images[activeImage]}
              alt={product.name}
              className="aspect-square w-full"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              {product.discount && (
                <span className="bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-wide px-2 py-1">
                  {product.discount}% OFF
                </span>
              )}
              {product.freeShipping && (
                <span className="bg-morelia-badge text-white text-[10px] uppercase tracking-wide px-2 py-1">
                  Envío gratis
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="font-serif text-3xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            {product.originalPrice && (
              <span className="text-base text-morelia-text-soft line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xl font-medium">
              {isCustomizable ? "Desde " : ""}
              {formatPrice(product.price)}
            </span>
          </div>
          {product.freeShipping && (
            <span className="inline-block bg-morelia-badge text-white text-[10px] uppercase tracking-wide px-2 py-1 w-fit mb-6">
              Envío gratis
            </span>
          )}

          {isCustomizable ? (
            <CustomizationForm product={product} onVariantImageChange={setVariantImage} />
          ) : (
            <>
              <div className="flex items-center gap-4 mb-2 mt-4">
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

              {hasProduct && (
                <p className="text-sm text-morelia-text-soft mb-6">
                  Ya agregaste este producto.{" "}
                  <button
                    onClick={() => useCartStore.getState().openDrawer()}
                    className="underline"
                  >
                    Ver carrito
                  </button>
                </p>
              )}
            </>
          )}

          <p
            className={`text-sm text-morelia-text-soft leading-relaxed mt-6 ${
              !expanded && "line-clamp-3"
            }`}
          >
            {product.description}
          </p>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-sm underline underline-offset-4 mt-2 w-fit"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>

          {product.stock !== null && (
            <p className="text-xs text-morelia-text-soft mt-6">
              Stock disponible: {product.stock} unidades
            </p>
          )}
          {product.sku && (
            <p className="text-xs text-morelia-text-soft">SKU: {product.sku}</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-8xl mx-auto px-4 py-16 border-t">
          <h2 className="text-center font-serif text-2xl mb-10">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
