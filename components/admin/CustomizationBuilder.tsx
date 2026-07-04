"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import { CustomizationChoice, CustomizationGroup, CustomizationGroupType } from "@/lib/types";
import ProductImage from "@/components/ui/ProductImage";

const typeLabels: Record<CustomizationGroupType, string> = {
  choice: "Selección única (imagen)",
  swatch: "Selección única (color)",
  "multi-choice": "Selección múltiple",
  quantity: "Cantidad con extra pago",
  text: "Texto libre",
};

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyChoice(): CustomizationChoice {
  return { id: uid(), label: "", priceDelta: 0 };
}

function emptyGroup(): CustomizationGroup {
  return {
    id: uid(),
    label: "",
    type: "choice",
    required: false,
    choices: [emptyChoice()],
  };
}

export default function CustomizationBuilder({
  groups,
  onChange,
}: {
  groups: CustomizationGroup[];
  onChange: (groups: CustomizationGroup[]) => void;
}) {
  function updateGroup(id: string, patch: Partial<CustomizationGroup>) {
    onChange(groups.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function removeGroup(id: string) {
    onChange(groups.filter((g) => g.id !== id));
  }

  function addGroup() {
    onChange([...groups, emptyGroup()]);
  }

  function changeType(group: CustomizationGroup, type: CustomizationGroupType) {
    const patch: Partial<CustomizationGroup> = { type };
    if (["choice", "swatch", "multi-choice"].includes(type) && !group.choices) {
      patch.choices = [emptyChoice()];
    }
    updateGroup(group.id, patch);
  }

  function updateChoice(group: CustomizationGroup, choiceId: string, patch: Partial<CustomizationChoice>) {
    updateGroup(group.id, {
      choices: group.choices?.map((c) => (c.id === choiceId ? { ...c, ...patch } : c)),
    });
  }

  function addChoice(group: CustomizationGroup) {
    updateGroup(group.id, { choices: [...(group.choices || []), emptyChoice()] });
  }

  function removeChoice(group: CustomizationGroup, choiceId: string) {
    updateGroup(group.id, { choices: group.choices?.filter((c) => c.id !== choiceId) });
  }

  return (
    <div className="space-y-4">
      {groups.length === 0 && (
        <p className="text-xs text-gray-400">
          Este producto no tiene opciones personalizables todavía.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.id} className="border border-gray-200 rounded p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Nombre del grupo (ej. Color, Charms)
                </label>
                <input
                  value={group.label}
                  onChange={(e) => updateGroup(group.id, { label: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                <select
                  value={group.type}
                  onChange={(e) => changeType(group, e.target.value as CustomizationGroupType)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeGroup(group.id)}
              className="text-red-600 mt-5 shrink-0"
              aria-label="Eliminar grupo"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={group.required}
              onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
            />
            Obligatorio (el cliente debe elegir para poder comprar)
          </label>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Texto de ayuda (opcional)
            </label>
            <input
              value={group.helpText || ""}
              onChange={(e) => updateGroup(group.id, { helpText: e.target.value })}
              placeholder="Ej: Podés elegir hasta 3 charms"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {(group.type === "choice" || group.type === "multi-choice" || group.type === "swatch") && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-gray-500">Opciones</label>
                {group.type === "multi-choice" && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    Máximo a elegir
                    <input
                      type="number"
                      min={1}
                      value={group.maxSelections ?? ""}
                      onChange={(e) =>
                        updateGroup(group.id, {
                          maxSelections: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 ml-1"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {group.choices?.map((choice) => (
                  <div key={choice.id} className="flex flex-wrap items-center gap-2">
                    {(group.type === "choice" || group.type === "swatch") && (
                      <ChoiceImagePicker
                        image={choice.image}
                        onChange={(image) => updateChoice(group, choice.id, { image })}
                      />
                    )}
                    <input
                      value={choice.label}
                      onChange={(e) => updateChoice(group, choice.id, { label: e.target.value })}
                      placeholder="Nombre (ej. Rojo)"
                      className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
                    />
                    {group.type === "swatch" && (
                      <input
                        type="color"
                        value={choice.color || "#cccccc"}
                        onChange={(e) => updateChoice(group, choice.id, { color: e.target.value })}
                        className="w-9 h-9 rounded border border-gray-300 p-0"
                      />
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      +$
                      <input
                        type="number"
                        min={0}
                        value={choice.priceDelta}
                        onChange={(e) =>
                          updateChoice(group, choice.id, { priceDelta: Number(e.target.value) })
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChoice(group, choice.id)}
                      className="text-red-600"
                      aria-label="Eliminar opción"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {(group.type === "choice" || group.type === "swatch") && (
                <p className="text-xs text-gray-400 mt-2">
                  Subí una foto por opción para que, al elegirla, la ficha del
                  producto muestre esa foto en vez de la genérica.
                </p>
              )}
              <button
                type="button"
                onClick={() => addChoice(group)}
                className="text-xs text-[#0070F3] mt-2 flex items-center gap-1"
              >
                <Plus size={12} /> Agregar opción
              </button>
            </div>
          )}

          {group.type === "quantity" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Unidades incluidas</label>
                <input
                  type="number"
                  min={0}
                  value={group.includedQty ?? 0}
                  onChange={(e) => updateGroup(group.id, { includedQty: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Precio por unidad extra</label>
                <input
                  type="number"
                  min={0}
                  value={group.extraUnitPrice ?? 0}
                  onChange={(e) => updateGroup(group.id, { extraUnitPrice: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Máximo (opcional)</label>
                <input
                  type="number"
                  min={0}
                  value={group.maxQty ?? ""}
                  onChange={(e) =>
                    updateGroup(group.id, {
                      maxQty: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {group.type === "text" && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Placeholder del campo</label>
              <input
                value={group.placeholder || ""}
                onChange={(e) => updateGroup(group.id, { placeholder: e.target.value })}
                placeholder="Ej: ¿Querés grabar una inicial?"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="flex items-center gap-1 text-sm text-[#0070F3]"
      >
        <Plus size={14} /> Agregar grupo de personalización
      </button>
    </div>
  );
}

function ChoiceImagePicker({
  image,
  onChange,
}: {
  image?: string;
  onChange: (image: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) onChange(data.url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <label
      className="relative w-9 h-9 shrink-0 border border-dashed border-gray-300 rounded overflow-hidden cursor-pointer flex items-center justify-center text-gray-400 hover:border-gray-400"
      title="Foto de esta opción"
    >
      {image ? (
        <ProductImage image={image} alt="Foto de la opción" className="w-full h-full" />
      ) : uploading ? (
        <span className="text-[9px]">...</span>
      ) : (
        <ImagePlus size={14} />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </label>
  );
}
