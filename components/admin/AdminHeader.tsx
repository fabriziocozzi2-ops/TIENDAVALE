"use client";

import { useState } from "react";
import { Search, Sparkles, CircleHelp } from "lucide-react";

export default function AdminHeader() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="sticky top-0 z-10">
      {!dismissed && (
        <div className="bg-[#E8F4FD] text-[#0070F3] text-xs px-4 py-2 flex items-center justify-center gap-4">
          <span>Estás en el plan Gratis · 7 días de prueba</span>
          <button className="underline">Elegir plan</button>
          <button onClick={() => setDismissed(true)} className="ml-2">
            ×
          </button>
        </div>
      )}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 flex-1 max-w-sm border border-gray-200 rounded px-3 py-1.5">
          <Search size={14} />
          <input
            placeholder="Buscar..."
            className="outline-none text-sm flex-1 placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-500 to-violet-500 text-white px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> Lumi
          </button>
          <CircleHelp size={18} className="text-gray-400" />
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
            M
          </div>
        </div>
      </header>
    </div>
  );
}
