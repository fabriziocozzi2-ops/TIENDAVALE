"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { CustomizationGroup, Product, SelectedCustomization } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cartStore";
import ProductImage from "@/components/ui/ProductImage";

type SelectionValue = string | string[] | number;
type Selections = Record<string, SelectionValue>;
export type OverlayCharm = { id: string; image: string };

function initialSelections(groups: CustomizationGroup[]): Selections {
  const initial: Selections = {};
  for (const group of groups) {
    if (group.type === "multi-choice") initial[group.id] = [];
    else if (group.type === "quantity") initial[group.id] = group.includedQty ?? 0;
    else initial[group.id] = "";
  }
  return initial;
}

export default function CustomizationForm({
  product,
  onVariantImageChange,
  onOverlayCharmsChange,
}: {
  product: Product;
  onVariantImageChange?: (image: string | null) => void;
  onOverlayCharmsChange?: (charms: OverlayCharm[]) => void;
}) {
  const groups = useMemo(() => product.customization ?? [], [product.customization]);
  const [selections, setSelections] = useState<Selections>(() => initialSelections(groups));
  const [showErrors, setShowErrors] = useState(false);
  const [added, setAdded] = useState(false);

  const addCustomizedItem = useCartStore((s) => s.addCustomizedItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const { total, summary, missingRequired, variantImage, overlayCharms } = useMemo(() => {
    let total = product.price;
    const summary: SelectedCustomization[] = [];
    const missingRequired: string[] = [];
    let variantImage: string | null = null;
    const overlayCharms: OverlayCharm[] = [];

    for (const group of groups) {
      const val = selections[group.id];

      if (group.type === "choice" || group.type === "swatch") {
        const choice = group.choices?.find((c) => c.id === val);
        if (choice) {
          total += choice.priceDelta;
          if (choice.image) variantImage = choice.image;
          summary.push({
            groupId: group.id,
            groupLabel: group.label,
            valueLabel: choice.label,
            priceDelta: choice.priceDelta,
          });
        } else if (group.required) {
          missingRequired.push(group.label);
        }
      } else if (group.type === "multi-choice") {
        const ids = (val as string[]) || [];
        const chosen = group.choices?.filter((c) => ids.includes(c.id)) || [];
        const delta = chosen.reduce((sum, c) => sum + c.priceDelta, 0);
        total += delta;
        for (const c of chosen) {
          if (c.image) overlayCharms.push({ id: c.id, image: c.image });
        }
        if (chosen.length) {
          summary.push({
            groupId: group.id,
            groupLabel: group.label,
            valueLabel: chosen.map((c) => c.label).join(", "),
            priceDelta: delta,
          });
        } else if (group.required) {
          missingRequired.push(group.label);
        }
      } else if (group.type === "quantity") {
        const qty = (val as number) ?? 0;
        const included = group.includedQty ?? 0;
        const extra = Math.max(0, qty - included);
        const delta = extra * (group.extraUnitPrice ?? 0);
        total += delta;
        summary.push({
          groupId: group.id,
          groupLabel: group.label,
          valueLabel: String(qty),
          priceDelta: delta,
        });
      } else if (group.type === "text") {
        const text = ((val as string) || "").trim();
        if (text) {
          summary.push({
            groupId: group.id,
            groupLabel: group.label,
            valueLabel: text,
            priceDelta: 0,
          });
        } else if (group.required) {
          missingRequired.push(group.label);
        }
      }
    }

    return { total, summary, missingRequired, variantImage, overlayCharms };
  }, [groups, selections, product.price]);

  useEffect(() => {
    onVariantImageChange?.(variantImage);
  }, [variantImage, onVariantImageChange]);

  useEffect(() => {
    onOverlayCharmsChange?.(overlayCharms);
  }, [overlayCharms, onOverlayCharmsChange]);

  function setValue(groupId: string, value: SelectionValue) {
    setSelections((s) => ({ ...s, [groupId]: value }));
    setAdded(false);
  }

  function toggleMultiChoice(group: CustomizationGroup, choiceId: string) {
    const current = (selections[group.id] as string[]) || [];
    const isSelected = current.includes(choiceId);
    if (isSelected) {
      setValue(group.id, current.filter((id) => id !== choiceId));
      return;
    }
    if (group.maxSelections && current.length >= group.maxSelections) return;
    setValue(group.id, [...current, choiceId]);
  }

  function handleAddToCart() {
    if (missingRequired.length > 0) {
      setShowErrors(true);
      return;
    }
    addCustomizedItem(product, total, 1, summary);
    setAdded(true);
  }

  return (
    <div className="mt-2">
      {groups.map((group) => (
        <div key={group.id} className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              {group.label}
              {group.required && <span className="text-morelia-error"> *</span>}
            </p>
            {group.type === "multi-choice" && group.maxSelections && (
              <span className="text-xs text-morelia-text-soft">
                {((selections[group.id] as string[]) || []).length}/{group.maxSelections}
              </span>
            )}
          </div>

          {(group.type === "choice" || group.type === "multi-choice") && (
            <div className="flex flex-wrap gap-3">
              {group.choices?.map((choice) => {
                const selected =
                  group.type === "choice"
                    ? selections[group.id] === choice.id
                    : ((selections[group.id] as string[]) || []).includes(choice.id);
                return (
                  <button
                    key={choice.id}
                    type="button"
                    title={`${choice.label}${choice.priceDelta ? ` (+${formatPrice(choice.priceDelta)})` : ""}`}
                    onClick={() =>
                      group.type === "choice"
                        ? setValue(group.id, choice.id)
                        : toggleMultiChoice(group, choice.id)
                    }
                    className="flex flex-col items-center gap-1"
                  >
                    <span
                      className={`relative w-12 h-12 border-2 ${
                        selected ? "border-morelia-text" : "border-transparent"
                      }`}
                    >
                      <ProductImage
                        image={choice.image || product.images[0]}
                        alt={choice.label}
                        className="w-full h-full"
                      />
                      {selected && (
                        <span className="absolute -top-1.5 -right-1.5 bg-morelia-text text-white rounded-full w-4 h-4 flex items-center justify-center">
                          <Check size={10} />
                        </span>
                      )}
                    </span>
                    {group.type === "choice" && group.choices!.length <= 3 && (
                      <span className="text-xs">{choice.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {group.type === "multi-choice" && group.choices?.some((c) => c.image) && (
            <p className="text-xs text-morelia-text-soft mt-2 italic">
              Podés arrastrar los dijes sobre la foto para acomodarlos como quieras.
            </p>
          )}

          {group.type === "swatch" && (
            <div className="flex flex-wrap gap-3">
              {group.choices?.map((choice) => {
                const selected = selections[group.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    title={`${choice.label}${choice.priceDelta ? ` (+${formatPrice(choice.priceDelta)})` : ""}`}
                    onClick={() => setValue(group.id, choice.id)}
                    className={`w-8 h-8 rounded-full border ${
                      selected ? "ring-2 ring-offset-2 ring-morelia-text" : "border-black/10"
                    }`}
                    style={{ backgroundColor: choice.color || "#ccc" }}
                  />
                );
              })}
            </div>
          )}

          {group.type === "quantity" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-morelia-text/20">
                <button
                  type="button"
                  className="px-3 py-2"
                  onClick={() =>
                    setValue(
                      group.id,
                      Math.max(group.includedQty ?? 0, ((selections[group.id] as number) ?? 0) - 1)
                    )
                  }
                  aria-label="Restar"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm">{selections[group.id] as number}</span>
                <button
                  type="button"
                  className="px-3 py-2"
                  onClick={() =>
                    setValue(
                      group.id,
                      Math.min(
                        group.maxQty ?? Infinity,
                        ((selections[group.id] as number) ?? 0) + 1
                      )
                    )
                  }
                  aria-label="Sumar"
                >
                  <Plus size={14} />
                </button>
              </div>
              {!!group.extraUnitPrice && (
                <span className="text-xs text-morelia-text-soft">
                  {group.includedQty ? `${group.includedQty} incluidas, ` : ""}
                  +{formatPrice(group.extraUnitPrice)} c/u extra
                </span>
              )}
            </div>
          )}

          {group.type === "text" && (
            <textarea
              value={(selections[group.id] as string) || ""}
              onChange={(e) => setValue(group.id, e.target.value)}
              placeholder={group.placeholder}
              rows={3}
              className="w-full border border-morelia-text/20 px-3 py-2 text-sm focus:outline-none"
            />
          )}

          {group.helpText && (
            <p className="text-xs text-morelia-text-soft mt-2 italic">{group.helpText}</p>
          )}

          {showErrors && group.required && missingRequired.includes(group.label) && (
            <p className="text-xs text-morelia-error mt-2">Este campo es obligatorio.</p>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 mt-8">
        <span className="text-lg font-medium">{formatPrice(total)}</span>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[var(--color-button)] text-white py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
        >
          Agregar al carrito
        </button>
      </div>

      {added && (
        <p className="text-sm text-morelia-text-soft mt-4">
          Ya agregaste este producto.{" "}
          <button onClick={openDrawer} className="underline">
            Ver carrito
          </button>
        </p>
      )}
    </div>
  );
}
