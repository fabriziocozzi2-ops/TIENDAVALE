"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Tag,
  Users,
  Percent,
  Paintbrush,
  LogOut,
  FolderTree,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin/inicio", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos", icon: Tag },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/descuentos", label: "Descuentos", icon: Percent },
  { href: "/admin/diseno", label: "Diseño", icon: Paintbrush },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`w-[260px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen fixed md:sticky top-0 z-50 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <span className="font-serif text-lg tracking-widest2">DS</span>
            <p className="text-[11px] text-gray-400 mt-0.5">Panel administrador</p>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400" aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-2.5 text-[13px] border-l-[3px] transition-colors ${
                  active
                    ? "bg-[#EBF5FF] text-[#0070F3] border-[#0070F3] font-medium"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            target="_blank"
            className="block text-[12px] text-gray-500 hover:text-gray-800 mb-2"
          >
            Ver tienda ↗
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-800"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
