"use client";

import { useEffect, useState } from "react";
import { Coupon } from "@/lib/types";

const typeLabels: Record<Coupon["type"], string> = {
  percentage: "% Porcentaje",
  fixed: "$ Monto fijo",
  "free-shipping": "Envío gratis",
};

export default function AdminDescuentosPage() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<Coupon["type"]>("percentage");
  const [value, setValue] = useState(10);

  function load() {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data.coupons));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, type, value: type === "free-shipping" ? 0 : value, maxUses: null }),
    });
    setCode("");
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl">Cupones</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#0070F3] text-white text-sm px-4 py-2 rounded whitespace-nowrap"
        >
          + Crear cupón
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded p-5 mb-6 max-w-lg space-y-4"
        >
          <div>
            <label className="block text-xs text-gray-500 mb-1">Código</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VERANO20"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm uppercase"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Coupon["type"])}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="percentage">% Porcentaje</option>
                <option value="fixed">$ Monto fijo</option>
                <option value="free-shipping">Envío gratis</option>
              </select>
            </div>
            {type !== "free-shipping" && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valor</label>
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#0070F3] text-white text-sm px-4 py-2 rounded"
          >
            Guardar cupón
          </button>
        </form>
      )}

      {coupons === null ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center max-w-lg">
          <p className="text-sm text-gray-500">
            Todavía no creaste ningún cupón de descuento.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Código</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 font-medium">Usos</th>
                  <th className="text-right px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{c.code}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{typeLabels[c.type]}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.type === "percentage" && `${c.value}%`}
                      {c.type === "fixed" && `$${c.value}`}
                      {c.type === "free-shipping" && "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.uses}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs text-red-600"
                      >
                        Eliminar
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
