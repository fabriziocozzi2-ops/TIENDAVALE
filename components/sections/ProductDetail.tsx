"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import ProductImage from "@/components/ui/ProductImage";
import ProductCard from "@/components/ui/ProductCard";
import CustomizationForm, { OverlayCharm } from "@/components/ui/CustomizationForm";

const CHARM_SIZE_PCT = 18; // % of the main image's width/height

function DraggableCharm({
  image,
  x,
  y,
  containerRef,
  onMove,
}: {
  image: string;
  x: number;
  y: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onMove: (x: number, y: number) => void;
}) {
  const draggingRef = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    const max = 100 - CHARM_SIZE_PCT;
    onMove(Math.min(max, Math.max(0, relX)), Math.min(max, Math.max(0, relY)));
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute cursor-grab active:cursor-grabbing touch-none select-none drop-shadow-md"
      style={{ left: `${x}%`, top: `${y}%`, width: `${CHARM_SIZE_PCT}%`, aspectRatio: "1 / 1" }}
      title="Arrastrá para mover"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" draggable={false} className="w-full h-full object-contain pointer-events-none" />
    </div>
  );
}

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [variantImage, setVariantImage] = useState<string | null>(null);
  const [overlayCharms, setOverlayCharms] = useState<OverlayCharm[]>([]);
  const [charmPositions, setCharmPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharmPositions((prev) => {
      const next: Record<string, { x: number; y: number }> = {};
      overlayCharms.forEach((charm, i) => {
        next[charm.id] = prev[charm.id] ?? {
          x: 50 + ((i % 3) - 1) * 14,
          y: 55 + Math.floor(i / 3) * 16,
        };
      });
      return next;
    });
  }, [overlayCharms]);

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
          <div ref={imageContainerRef} className="relative flex-1">
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
            {overlayCharms.map((charm) => {
              const pos = charmPositions[charm.id] ?? { x: 50, y: 60 };
              return (
                <DraggableCharm
                  key={charm.id}
                  image={charm.image}
                  x={pos.x}
                  y={pos.y}
                  containerRef={imageContainerRef}
                  onMove={(x, y) =>
                    setCharmPositions((p) => ({ ...p, [charm.id]: { x, y } }))
                  }
                />
              );
            })}
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
            <CustomizationForm
              product={product}
              onVariantImageChange={setVariantImage}
              onOverlayCharmsChange={setOverlayCharms}
            />
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
