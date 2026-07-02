"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[#0070F3] text-white text-sm px-4 py-2 rounded"
        >
          + Agregar producto
        </Link>
      </div>

      {products === null ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400">No hay productos cargados.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Precio</th>
                <th className="text-left px-4 py-3 font-medium">Categoría</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage image={p.images[0]} alt={p.name} className="w-10 h-10" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.stock === null ? "∞ Infinito" : p.stock}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="text-[#0070F3] text-xs"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
