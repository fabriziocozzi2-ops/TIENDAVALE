"use client";

import { useState } from "react";
import { Search, Sparkles, CircleHelp, Menu } from "lucide-react";

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="sticky top-0 z-30">
      {!dismissed && (
        <div className="bg-[#E8F4FD] text-[#0070F3] text-xs px-4 py-2 flex items-center justify-center gap-2 sm:gap-4 text-center">
          <span className="hidden sm:inline">Estás en el plan Gratis · 7 días de prueba</span>
          <span className="sm:hidden">Plan Gratis · 7 días</span>
          <button className="underline whitespace-nowrap">Elegir plan</button>
          <button onClick={() => setDismissed(true)} className="ml-1">
            ×
          </button>
        </div>
      )}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-500 shrink-0"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400 flex-1 max-w-sm border border-gray-200 rounded px-3 py-1.5 min-w-0">
            <Search size={14} className="shrink-0" />
            <input
              placeholder="Buscar..."
              className="outline-none text-sm flex-1 min-w-0 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button className="hidden sm:flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-500 to-violet-500 text-white px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> Lumi
          </button>
          <CircleHelp size={18} className="hidden sm:block text-gray-400" />
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center shrink-0">
            M
          </div>
        </div>
      </header>
    </div>
  );
}
