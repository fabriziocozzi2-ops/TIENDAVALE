"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "morelia-cookies-accepted";

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-morelia-text/10 px-4 py-4">
      <div className="max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <p className="text-xs text-morelia-text-soft max-w-2xl">
          Al navegar por este sitio aceptás el uso de cookies para agilizar
          tu experiencia de compra.
        </p>
        <button
          onClick={accept}
          className="text-xs underline font-medium whitespace-nowrap hover:opacity-60 transition-opacity"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
