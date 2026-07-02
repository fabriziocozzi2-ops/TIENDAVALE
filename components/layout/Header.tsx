"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingCart, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { categories } from "@/lib/data/categories";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const productsRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((s) => s.totalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-xl tracking-widest2 font-medium shrink-0">
              MORELIA
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <div ref={productsRef} className="relative">
                <button
                  onClick={() => setProductsOpen((v) => !v)}
                  className="flex items-center gap-1 hover:opacity-60 transition-opacity"
                >
                  Productos <ChevronDown size={14} />
                </button>
                {productsOpen && (
                  <div className="absolute left-0 top-full mt-3 bg-white border border-morelia-text/10 shadow-lg py-2 w-52">
                    <Link
                      href="/productos"
                      onClick={() => setProductsOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-morelia-bg-alt"
                    >
                      Todos los productos
                    </Link>
                    <div className="border-t border-morelia-text/10 my-1" />
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}`}
                        onClick={() => setProductsOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-morelia-bg-alt"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/contacto" className="hover:opacity-60 transition-opacity">
                Contacto
              </Link>
              <Link href="/preguntas-frecuentes" className="hover:opacity-60 transition-opacity">
                Preguntas frecuentes (FAQ)
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <span className="hidden sm:flex items-center gap-0.5 text-xs text-morelia-text-soft px-2 py-1 mr-1">
              ARS <ChevronDown size={12} />
            </span>
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/cuenta" aria-label="Mi cuenta" className="p-2 hover:opacity-60 transition-opacity">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button
              aria-label="Carrito"
              onClick={openDrawer}
              className="relative p-2 hover:opacity-60 transition-opacity"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-button)] text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="flex md:hidden items-center gap-5 text-sm overflow-x-auto no-scrollbar pb-3 border-t border-morelia-text/5 pt-3">
          <Link href="/productos" className="whitespace-nowrap hover:opacity-60 transition-opacity">
            Productos
          </Link>
          <Link href="/contacto" className="whitespace-nowrap hover:opacity-60 transition-opacity">
            Contacto
          </Link>
          <Link href="/preguntas-frecuentes" className="whitespace-nowrap hover:opacity-60 transition-opacity">
            FAQ
          </Link>
        </nav>

        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 flex items-center gap-2 border-t pt-4"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 border-b border-morelia-text/30 py-2 text-sm focus:outline-none focus:border-morelia-text"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Cerrar búsqueda"
              className="p-2"
            >
              <X size={18} />
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
