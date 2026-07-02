"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

type SortOption = "relevancia" | "menor-precio" | "mayor-precio";

export default function CategoryProductGrid({
  products,
}: {
  products: Product[];
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (freeShippingOnly) list = list.filter((p) => p.freeShipping);
    if (sort === "menor-precio") list.sort((a, b) => a.price - b.price);
    if (sort === "mayor-precio") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort, freeShippingOnly]);

  return (
    <section className="max-w-8xl mx-auto px-4 py-10">
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 text-sm border border-morelia-text/30 px-5 py-2 hover:bg-morelia-bg-alt transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filtrar
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-sm border-y py-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={freeShippingOnly}
              onChange={(e) => setFreeShippingOnly(e.target.checked)}
            />
            Solo envío gratis
          </label>
          <div className="flex items-center gap-2">
            <span>Ordenar por</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border border-morelia-text/20 px-2 py-1"
            >
              <option value="relevancia">Relevancia</option>
              <option value="menor-precio">Menor precio</option>
              <option value="mayor-precio">Mayor precio</option>
            </select>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-morelia-text-soft py-16">
          No hay productos que coincidan con los filtros seleccionados.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
