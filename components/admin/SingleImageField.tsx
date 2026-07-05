"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import ImageCropModal from "@/components/admin/ImageCropModal";

export default function SingleImageField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleCropConfirm(blob: Blob) {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], pendingFile.name.replace(/\.[^.]+$/, "") + ".png", { type: "image/png" })
      );
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) onChange(data.url);
    } finally {
      setUploading(false);
      setPendingFile(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleCropCancel() {
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <Upload size={14} className="text-gray-300" />
          )}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs text-[#0070F3] cursor-pointer w-fit">
            <Upload size={12} />
            {uploading ? "Subiendo..." : value ? "Cambiar foto" : "Subir foto"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                setPendingFile(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="flex items-center gap-1 text-[11px] text-red-600 mt-1"
            >
              <X size={11} /> Quitar
            </button>
          )}
        </div>
      </div>
      {pendingFile && (
        <ImageCropModal file={pendingFile} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />
      )}
    </div>
  );
}
