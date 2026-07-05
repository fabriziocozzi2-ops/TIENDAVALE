"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

type Rect = { x: number; y: number; width: number; height: number }; // percentages 0-100
type DragMode = "move" | "nw" | "ne" | "sw" | "se";

const MIN_SIZE = 8;

function clampRect(r: Rect): Rect {
  let { x, y, width, height } = r;
  width = Math.max(MIN_SIZE, Math.min(100, width));
  height = Math.max(MIN_SIZE, Math.min(100, height));
  x = Math.max(0, Math.min(100 - width, x));
  y = Math.max(0, Math.min(100 - height, y));
  return { x, y, width, height };
}

export default function ImageCropModal({
  file,
  onCancel,
  onConfirm,
}: {
  file: File;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [src, setSrc] = useState("");
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 10, y: 10, width: 80, height: 80 });
  const [confirming, setConfirming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ mode: DragMode; startX: number; startY: number; startRect: Rect } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handlePointerDown(mode: DragMode) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = { mode, startX: e.clientX, startY: e.clientY, startRect: rect };
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !stageRef.current) return;
    const stage = stageRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - ds.startX) / stage.width) * 100;
    const dyPct = ((e.clientY - ds.startY) / stage.height) * 100;
    const next: Rect = { ...ds.startRect };

    if (ds.mode === "move") {
      next.x = ds.startRect.x + dxPct;
      next.y = ds.startRect.y + dyPct;
    } else {
      if (ds.mode === "nw" || ds.mode === "sw") {
        next.x = ds.startRect.x + dxPct;
        next.width = ds.startRect.width - dxPct;
      }
      if (ds.mode === "ne" || ds.mode === "se") {
        next.width = ds.startRect.width + dxPct;
      }
      if (ds.mode === "nw" || ds.mode === "ne") {
        next.y = ds.startRect.y + dyPct;
        next.height = ds.startRect.height - dyPct;
      }
      if (ds.mode === "sw" || ds.mode === "se") {
        next.height = ds.startRect.height + dyPct;
      }
    }
    setRect(clampRect(next));
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleConfirm() {
    const img = imgRef.current;
    if (!img || !naturalSize) return;
    setConfirming(true);
    const cropX = (rect.x / 100) * naturalSize.width;
    const cropY = (rect.y / 100) * naturalSize.height;
    const cropW = (rect.width / 100) * naturalSize.width;
    const cropH = (rect.height / 100) * naturalSize.height;

    const maxDim = 1600;
    let outW = cropW;
    let outH = cropH;
    if (outW > maxDim || outH > maxDim) {
      const scale = maxDim / Math.max(outW, outH);
      outW *= scale;
      outH *= scale;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(outW));
    canvas.height = Math.max(1, Math.round(outH));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setConfirming(false);
      return;
    }
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setConfirming(false);
      if (blob) onConfirm(blob);
    }, "image/png");
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded max-w-lg w-full p-4">
        <p className="text-sm font-medium mb-1">Recortá la imagen</p>
        <p className="text-xs text-gray-400 mb-3">
          Arrastrá el recuadro para moverlo y las esquinas para cambiar su tamaño.
        </p>
        <div
          ref={stageRef}
          className="relative mx-auto select-none touch-none bg-gray-100"
          style={{
            maxHeight: "60vh",
            maxWidth: "100%",
            aspectRatio: naturalSize ? `${naturalSize.width} / ${naturalSize.height}` : undefined,
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={src}
              alt="Imagen a recortar"
              draggable={false}
              className="w-full h-full block select-none"
              onLoad={(e) => {
                const el = e.currentTarget;
                setNaturalSize({ width: el.naturalWidth, height: el.naturalHeight });
              }}
            />
          )}
          {naturalSize && (
            <div
              onPointerDown={handlePointerDown("move")}
              className="absolute border-2 border-white cursor-move"
              style={{
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
              }}
            >
              {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                <div
                  key={corner}
                  onPointerDown={handlePointerDown(corner)}
                  className={`absolute w-3.5 h-3.5 bg-white border border-gray-400 rounded-full ${
                    corner === "nw" ? "-top-1.5 -left-1.5 cursor-nwse-resize" : ""
                  } ${corner === "ne" ? "-top-1.5 -right-1.5 cursor-nesw-resize" : ""} ${
                    corner === "sw" ? "-bottom-1.5 -left-1.5 cursor-nesw-resize" : ""
                  } ${corner === "se" ? "-bottom-1.5 -right-1.5 cursor-nwse-resize" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button type="button" onClick={onCancel} className="text-sm text-gray-600 px-4 py-2">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!naturalSize || confirming}
            className="flex items-center gap-1.5 bg-[#0070F3] text-white text-sm px-4 py-2 rounded disabled:opacity-60"
          >
            <Check size={14} /> {confirming ? "Procesando..." : "Usar esta foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
