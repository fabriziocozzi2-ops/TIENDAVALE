"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Upload, X, Plus, Trash2 } from "lucide-react";
import {
  ThemeSettings,
  HomeContent,
  HeroSlideContent,
  BannerContent,
  TestimonialContent,
  IconInfoItemContent,
} from "@/lib/server/db";
import ImageCropModal from "@/components/admin/ImageCropModal";
import SingleImageField from "@/components/admin/SingleImageField";

export default function AdminDisenoPage() {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [products, setProducts] = useState<{ id: number; name: string }[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((res) => res.json())
      .then((data) => setTheme(data.theme));
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }))));
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

  function updateContent<K extends keyof HomeContent>(key: K, value: HomeContent[K]) {
    setTheme((t) => (t ? { ...t, content: { ...t.content, [key]: value } } : t));
    setSaved(false);
  }

  function updateSlide(index: number, patch: Partial<HeroSlideContent>) {
    setTheme((t) => {
      if (!t) return t;
      const slides = t.content.slider.slides.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...t, content: { ...t.content, slider: { slides } } };
    });
    setSaved(false);
  }

  function addSlide() {
    setTheme((t) =>
      t
        ? {
            ...t,
            content: {
              ...t.content,
              slider: {
                slides: [
                  ...t.content.slider.slides,
                  { title: "", subtitle: "", ctaLabel: "Comprar", ctaHref: "/" },
                ],
              },
            },
          }
        : t
    );
    setSaved(false);
  }

  function removeSlide(index: number) {
    setTheme((t) =>
      t
        ? {
            ...t,
            content: {
              ...t.content,
              slider: { slides: t.content.slider.slides.filter((_, i) => i !== index) },
            },
          }
        : t
    );
    setSaved(false);
  }

  function updateBanner(index: number, patch: Partial<BannerContent>) {
    setTheme((t) => {
      if (!t) return t;
      const banners = t.content.banners.map((b, i) => (i === index ? { ...b, ...patch } : b));
      return { ...t, content: { ...t.content, banners } };
    });
    setSaved(false);
  }

  function addBanner() {
    setTheme((t) =>
      t
        ? { ...t, content: { ...t.content, banners: [...t.content.banners, { title: "", href: "/" }] } }
        : t
    );
    setSaved(false);
  }

  function removeBanner(index: number) {
    setTheme((t) =>
      t
        ? { ...t, content: { ...t.content, banners: t.content.banners.filter((_, i) => i !== index) } }
        : t
    );
    setSaved(false);
  }

  function updateTestimonial(index: number, patch: Partial<TestimonialContent>) {
    setTheme((t) => {
      if (!t) return t;
      const testimonials = t.content.testimonials.map((x, i) => (i === index ? { ...x, ...patch } : x));
      return { ...t, content: { ...t.content, testimonials } };
    });
    setSaved(false);
  }

  function addTestimonial() {
    setTheme((t) =>
      t
        ? { ...t, content: { ...t.content, testimonials: [...t.content.testimonials, { text: "", name: "" }] } }
        : t
    );
    setSaved(false);
  }

  function removeTestimonial(index: number) {
    setTheme((t) =>
      t
        ? {
            ...t,
            content: { ...t.content, testimonials: t.content.testimonials.filter((_, i) => i !== index) },
          }
        : t
    );
    setSaved(false);
  }

  function updateIconInfoItem(index: number, patch: Partial<IconInfoItemContent>) {
    setTheme((t) => {
      if (!t) return t;
      const iconInfo = t.content.iconInfo.map((x, i) => (i === index ? { ...x, ...patch } : x));
      return { ...t, content: { ...t.content, iconInfo } };
    });
    setSaved(false);
  }

  function handleLogoFile(file: File | undefined) {
    if (!file) return;
    setPendingLogoFile(file);
  }

  async function handleLogoCropConfirm(blob: Blob) {
    if (!pendingLogoFile) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], pendingLogoFile.name.replace(/\.[^.]+$/, "") + ".png", { type: "image/png" })
      );
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setTheme((t) => (t ? { ...t, logoUrl: data.url } : t));
        setSaved(false);
      }
    } finally {
      setUploadingLogo(false);
      setPendingLogoFile(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  function handleLogoCropCancel() {
    setPendingLogoFile(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
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

  const content = theme.content;

  return (
    <div className="max-w-3xl">
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
                onChange={(e) => {
                  handleLogoFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
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
        {pendingLogoFile && (
          <ImageCropModal
            file={pendingLogoFile}
            onCancel={handleLogoCropCancel}
            onConfirm={handleLogoCropConfirm}
          />
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h2 className="text-sm font-medium mb-4">Colores de tu marca</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <h2 className="font-serif text-xl mb-4 mt-10">Contenido de cada sección</h2>
      <p className="text-xs text-gray-400 mb-4">
        Editá los textos y las fotos de cada bloque de tu home. El ícono y el
        diseño de cada sección quedan fijos, pero el texto y la imagen son
        tuyos.
      </p>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Mensaje de bienvenida</h3>
        <textarea
          value={content.welcome.text}
          onChange={(e) => updateContent("welcome", { text: e.target.value })}
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Carrusel de imágenes</h3>
          <button
            type="button"
            onClick={addSlide}
            className="flex items-center gap-1 text-xs text-[#0070F3]"
          >
            <Plus size={12} /> Agregar imagen
          </button>
        </div>
        <div className="space-y-4">
          {content.slider.slides.map((slide, i) => (
            <div key={i} className="border border-gray-200 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <SingleImageField
                  label="Foto de fondo"
                  value={slide.image}
                  onChange={(url) => updateSlide(i, { image: url })}
                />
                <button
                  type="button"
                  onClick={() => removeSlide(i)}
                  className="text-red-600 ml-auto"
                  aria-label="Eliminar imagen del carrusel"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Título</label>
                  <input
                    value={slide.title}
                    onChange={(e) => updateSlide(i, { title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subtítulo</label>
                  <input
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(i, { subtitle: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Texto del botón</label>
                  <input
                    value={slide.ctaLabel}
                    onChange={(e) => updateSlide(i, { ctaLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Link del botón</label>
                  <input
                    value={slide.ctaHref}
                    onChange={(e) => updateSlide(i, { ctaHref: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          {content.slider.slides.length === 0 && (
            <p className="text-xs text-gray-400">No hay imágenes en el carrusel.</p>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Productos destacados</h3>
        <label className="block text-xs text-gray-500 mb-1">Título de la sección</label>
        <input
          value={content.featured.title}
          onChange={(e) => updateContent("featured", { title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-2">
          Los productos que se muestran acá son los que marcaste como
          &ldquo;En inicio&rdquo; al editar cada producto.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Mensaje institucional</h3>
        <label className="block text-xs text-gray-500 mb-1">Texto pequeño de arriba</label>
        <input
          value={content.mission.eyebrow}
          onChange={(e) => updateContent("mission", { ...content.mission, eyebrow: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
        />
        <label className="block text-xs text-gray-500 mb-1">Frase destacada</label>
        <textarea
          value={content.mission.quote}
          onChange={(e) => updateContent("mission", { ...content.mission, quote: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Texto del link</label>
            <input
              value={content.mission.linkLabel}
              onChange={(e) =>
                updateContent("mission", { ...content.mission, linkLabel: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Link</label>
            <input
              value={content.mission.linkHref}
              onChange={(e) =>
                updateContent("mission", { ...content.mission, linkHref: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Producto principal</h3>
        <label className="block text-xs text-gray-500 mb-1">Elegí qué producto destacar</label>
        <select
          value={content.featuredDetail.productId ?? ""}
          onChange={(e) =>
            updateContent("featuredDetail", {
              productId: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">El primero de la lista (automático)</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Banners promocionales</h3>
          <button
            type="button"
            onClick={addBanner}
            className="flex items-center gap-1 text-xs text-[#0070F3]"
          >
            <Plus size={12} /> Agregar banner
          </button>
        </div>
        <div className="space-y-4">
          {content.banners.map((banner, i) => (
            <div key={i} className="border border-gray-200 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <SingleImageField
                  label="Foto de fondo"
                  value={banner.image}
                  onChange={(url) => updateBanner(i, { image: url })}
                />
                <button
                  type="button"
                  onClick={() => removeBanner(i)}
                  className="text-red-600 ml-auto"
                  aria-label="Eliminar banner"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Texto</label>
                  <input
                    value={banner.title}
                    onChange={(e) => updateBanner(i, { title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Link (&ldquo;Comprar&rdquo;)</label>
                  <input
                    value={banner.href}
                    onChange={(e) => updateBanner(i, { href: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Testimonios</h3>
          <button
            type="button"
            onClick={addTestimonial}
            className="flex items-center gap-1 text-xs text-[#0070F3]"
          >
            <Plus size={12} /> Agregar testimonio
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">Se muestran hasta 3 en la home.</p>
        <div className="space-y-4">
          {content.testimonials.map((t, i) => (
            <div key={i} className="border border-gray-200 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <SingleImageField
                  label="Foto (opcional)"
                  value={t.photo}
                  onChange={(url) => updateTestimonial(i, { photo: url })}
                />
                <button
                  type="button"
                  onClick={() => removeTestimonial(i)}
                  className="text-red-600 ml-auto"
                  aria-label="Eliminar testimonio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Texto</label>
                <textarea
                  value={t.text}
                  onChange={(e) => updateTestimonial(i, { text: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nombre</label>
                <input
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, { name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Handmade</h3>
        <div className="flex items-start gap-3 mb-3">
          <SingleImageField
            label="Foto de fondo (opcional)"
            value={content.handmade.image}
            onChange={(url) => updateContent("handmade", { ...content.handmade, image: url })}
          />
        </div>
        <label className="block text-xs text-gray-500 mb-1">Título</label>
        <input
          value={content.handmade.title}
          onChange={(e) => updateContent("handmade", { ...content.handmade, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
        />
        <label className="block text-xs text-gray-500 mb-1">Texto</label>
        <textarea
          value={content.handmade.text}
          onChange={(e) => updateContent("handmade", { ...content.handmade, text: e.target.value })}
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-1">Información de envío</h3>
        <p className="text-xs text-gray-400 mb-3">Los 3 íconos quedan fijos, pero podés cambiar los textos.</p>
        <div className="space-y-4">
          {content.iconInfo.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded p-4 space-y-2">
              <label className="block text-xs text-gray-500 mb-1">Título</label>
              <input
                value={item.title}
                onChange={(e) => updateIconInfoItem(i, { title: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
              />
              <label className="block text-xs text-gray-500 mb-1">Texto</label>
              <textarea
                value={item.text}
                onChange={(e) => updateIconInfoItem(i, { text: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">Newsletter e Instagram</h3>
        <label className="block text-xs text-gray-500 mb-1">Título</label>
        <input
          value={content.newsletter.title}
          onChange={(e) => updateContent("newsletter", { ...content.newsletter, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Usuario de Instagram</label>
            <input
              value={content.newsletter.instagramHandle}
              onChange={(e) =>
                updateContent("newsletter", { ...content.newsletter, instagramHandle: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Link a Instagram</label>
            <input
              value={content.newsletter.instagramHref}
              onChange={(e) =>
                updateContent("newsletter", { ...content.newsletter, instagramHref: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 sticky bottom-4">
        <button
          onClick={handlePublish}
          disabled={saving}
          className="bg-[#0070F3] text-white text-sm px-5 py-2.5 rounded disabled:opacity-60 shadow-lg"
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
