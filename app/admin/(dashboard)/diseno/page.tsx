"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Upload, X } from "lucide-react";
import { ThemeSettings } from "@/lib/server/db";

export default function AdminDisenoPage() {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((res) => res.json())
      .then((data) => setTheme(data.theme));
  }, []);

  function updateColor(key: keyof ThemeSettings["colors"], value: string) {
    setTheme((t) => (t ? { ...t, colors: { ...t.colors, [key]: value } } : t));
    setSaved(false);
  }

  function toggleVisible(id: string) {
    setTheme((t) =>
      t
        ? {
            ...t,
            homepage: {
              sections: t.homepage.sections.map((s) =>
                s.id === id ? { ...s, visible: !s.visible } : s
              ),
            },
          }
        : t
    );
    setSaved(false);
  }

  function move(id: string, direction: -1 | 1) {
    setTheme((t) => {
      if (!t) return t;
      const sections = [...t.homepage.sections];
      const index = sections.findIndex((s) => s.id === id);
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= sections.length) return t;
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return { ...t, homepage: { sections } };
    });
    setSaved(false);
  }

  async function handleLogoUpload(file: File | undefined) {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setTheme((t) => (t ? { ...t, logoUrl: data.url } : t));
        setSaved(false);
      }
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  function removeLogo() {
    setTheme((t) => (t ? { ...t, logoUrl: undefined } : t));
    setSaved(false);
  }

  async function handlePublish() {
    if (!theme) return;
    setSaving(true);
    await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!theme) return <p className="text-sm text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl mb-6">Diseño</h1>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h2 className="text-sm font-medium mb-4">Logo de tu marca</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-50">
            {theme.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={theme.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="font-serif text-lg text-gray-300">DS</span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-[#0070F3] cursor-pointer w-fit">
              <Upload size={14} />
              {uploadingLogo ? "Subiendo..." : "Subir logo"}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                disabled={uploadingLogo}
                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
              />
            </label>
            {theme.logoUrl && (
              <button
                onClick={removeLogo}
                className="flex items-center gap-1 text-xs text-red-600 mt-2"
              >
                <X size={12} /> Quitar logo (usar texto &ldquo;DS&rdquo;)
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h2 className="text-sm font-medium mb-4">Colores de tu marca</h2>
        <div className="grid grid-cols-2 gap-4">
          <ColorField
            label="Color de fondo"
            value={theme.colors.background}
            onChange={(v) => updateColor("background", v)}
          />
          <ColorField
            label="Color de textos"
            value={theme.colors.text}
            onChange={(v) => updateColor("text", v)}
          />
          <ColorField
            label="Color de acento"
            value={theme.colors.accent}
            onChange={(v) => updateColor("accent", v)}
          />
          <ColorField
            label="Botón principal"
            value={theme.colors.button}
            onChange={(v) => updateColor("button", v)}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          El acento aplica a textos de descuento, envío gratis y cuotas sin
          interés.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h2 className="text-sm font-medium mb-1">Página de inicio</h2>
        <p className="text-xs text-gray-400 mb-4">
          Reordená y mostrá u ocultá las secciones de tu home.
        </p>
        <ul className="divide-y">
          {theme.homepage.sections.map((section, i) => (
            <li key={section.id} className="flex items-center gap-3 py-2.5">
              <div className="flex flex-col">
                <button
                  onClick={() => move(section.id, -1)}
                  disabled={i === 0}
                  className="disabled:opacity-20"
                  aria-label="Subir"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => move(section.id, 1)}
                  disabled={i === theme.homepage.sections.length - 1}
                  className="disabled:opacity-20"
                  aria-label="Bajar"
                >
                  <ArrowDown size={13} />
                </button>
              </div>
              <span className={`flex-1 text-sm ${!section.visible && "text-gray-400"}`}>
                {section.label}
              </span>
              <button onClick={() => toggleVisible(section.id)} aria-label="Alternar visibilidad">
                {section.visible ? (
                  <Eye size={16} className="text-gray-500" />
                ) : (
                  <EyeOff size={16} className="text-gray-300" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePublish}
          disabled={saving}
          className="bg-[#0070F3] text-white text-sm px-5 py-2.5 rounded disabled:opacity-60"
        >
          {saving ? "Publicando..." : "Publicar cambios"}
        </button>
        {saved && <span className="text-xs text-green-600">¡Cambios publicados!</span>}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded-full overflow-hidden border-0 p-0"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}
