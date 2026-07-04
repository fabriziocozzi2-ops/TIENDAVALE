"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Error al crear la categoría");
      return;
    }
    setName("");
    load();
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos que la usan no se borran, pero quedarán sin categoría visible.`)) return;
    await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl mb-6">Categorías</h1>

      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded p-5 mb-6 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Nueva categoría</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Mochilas"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0070F3] text-white text-sm px-4 py-2 rounded disabled:opacity-60 whitespace-nowrap"
        >
          {saving ? "Creando..." : "Crear"}
        </button>
      </form>
      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {categories === null ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium">Slug (URL)</th>
                  <th className="text-right px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-4 py-3 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">/{c.slug}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(c.slug, c.name)}
                        className="text-red-600"
                        aria-label="Eliminar categoría"
                      >
                        <Trash2 size={14} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
