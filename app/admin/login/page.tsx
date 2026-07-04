"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/inicio");
      router.refresh();
    } else {
      setError("Contraseña incorrecta.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-morelia-bg-alt px-4">
      <div className="bg-white w-full max-w-sm p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-center mb-1">DS</h1>
        <p className="text-center text-sm text-morelia-text-soft mb-8">
          Panel de administración
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
          />
          {error && <p className="text-xs text-morelia-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-morelia-button text-white py-3 text-sm uppercase tracking-wide hover:bg-morelia-button-hover transition-colors disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
