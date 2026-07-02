"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { categories } from "@/lib/data/categories";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  slug: "",
  price: 0,
  originalPrice: null,
  discount: null,
  category: "bolsos",
  freeShipping: false,
  images: [],
  description: "",
  featuredHome: false,
  featuredCategory: false,
  stock: null,
  sku: "",
};

export default function ProductForm({
  product,
}: {
  product?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Product, "id">>(
    product ?? emptyProduct
  );
  const [infiniteStock, setInfiniteStock] = useState(
    product ? product.stock === null : true
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, stock: infiniteStock ? null : form.stock ?? 0 };

    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);
    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <section className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-sm font-medium mb-4">Nombre y descripción</h2>
        <label className="block text-xs text-gray-500 mb-1">Nombre</label>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
        />
        <label className="block text-xs text-gray-500 mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </section>

      <section className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-sm font-medium mb-4">Precio</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Precio</label>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Precio promocional (opcional)
            </label>
            <input
              type="number"
              min={0}
              value={form.originalPrice ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                update("originalPrice", val);
                if (val) {
                  update("discount", Math.round(((val - form.price) / val) * 100));
                } else {
                  update("discount", null);
                }
              }}
              placeholder="Precio antes del descuento"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-sm font-medium mb-4">Stock e identificadores</h2>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={infiniteStock}
              onChange={() => setInfiniteStock(true)}
            />
            Infinito
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!infiniteStock}
              onChange={() => setInfiniteStock(false)}
            />
            Ingresar cantidad
          </label>
          {!infiniteStock && (
            <input
              type="number"
              min={0}
              value={form.stock ?? 0}
              onChange={(e) => update("stock", Number(e.target.value))}
              className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          )}
        </div>
        <label className="block text-xs text-gray-500 mb-1">SKU</label>
        <input
          value={form.sku}
          onChange={(e) => update("sku", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </section>

      <section className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-sm font-medium mb-4">Categoría y envío</h2>
        <label className="block text-xs text-gray-500 mb-1">Categoría</label>
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value as Product["category"])}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.freeShipping}
            onChange={(e) => update("freeShipping", e.target.checked)}
          />
          Envío gratis
        </label>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-sm font-medium mb-4">Destacar producto</h2>
        <p className="text-xs text-gray-500 mb-3">
          Elegí en qué secciones de tu tienda querés destacar este producto.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featuredHome}
            onChange={(e) => update("featuredHome", e.target.checked)}
          />
          En inicio (&ldquo;Los más elegidos&rdquo;)
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0070F3] text-white text-sm px-5 py-2.5 rounded disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar producto"}
        </button>
        {product && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 px-4 py-2.5"
          >
            Eliminar producto
          </button>
        )}
      </div>
    </form>
  );
}
