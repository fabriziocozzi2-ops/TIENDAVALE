"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { categories } from "@/lib/data/categories";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const totalItems = useCartStore((s) => s.totalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
        <div className="relative flex items-center justify-center h-16">
          <button
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
            className="absolute left-0 p-2 hover:opacity-60 transition-opacity"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl tracking-widest2 font-medium"
          >
            MORELIA
          </Link>

          <div className="absolute right-0 flex items-center gap-4">
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

        <nav className="flex justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar text-sm pb-4 border-t border-morelia-text/5 pt-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="whitespace-nowrap text-morelia-text hover:opacity-60 transition-opacity"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
