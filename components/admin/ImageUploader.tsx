"use client";

import { useRef, useState } from "react";
import { X, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al subir la imagen");
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const next = [...images];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((img, i) => (
            <div key={img + i} className="relative w-24 h-24 border border-gray-200 rounded overflow-hidden group">
              <ProductImage image={img} alt={`Foto ${i + 1}`} className="w-full h-full" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-red-600"
                aria-label="Eliminar foto"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="bg-white/90 rounded p-0.5 disabled:opacity-30"
                  aria-label="Mover a la izquierda"
                >
                  <ArrowLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="bg-white/90 rounded p-0.5 disabled:opacity-30"
                  aria-label="Mover a la derecha"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-[#0070F3] cursor-pointer w-fit">
        <Upload size={14} />
        {uploading ? "Subiendo..." : "Subir fotos"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP o GIF. Máximo 5MB por foto.</p>
    </div>
  );
}
