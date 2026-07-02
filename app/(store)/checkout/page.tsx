"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import ProgressBar from "@/components/checkout/ProgressBar";
import OrderSummary from "@/components/checkout/OrderSummary";
import { formatPrice } from "@/lib/format";

type Step = "entrega" | "pago" | "confirmado";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>("entrega");
  const [email, setEmail] = useState("");
  const [wantsOffers, setWantsOffers] = useState(true);
  const [postalCode, setPostalCode] = useState("");
  const [postalError, setPostalError] = useState("");

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const shipping = items.every((i) => i.freeShipping) ? 0 : 1500;

  useEffect(() => {
    if (items.length === 0 && step !== "confirmado") {
      router.replace("/");
    }
  }, [items.length, step, router]);

  function handleEntregaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (postalCode.trim().length < 4) {
      setPostalError("No hay opciones de envío disponibles para esta dirección.");
      return;
    }
    setPostalError("");
    setStep("pago");
  }

  async function handlePagoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          postalCode,
          items,
          paymentMethod,
          customerName: fullName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(data.order.number);
        clearCart();
        setStep("confirmado");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirmado") {
    return (
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">¡Gracias por tu compra!</h1>
        <p className="text-morelia-text-soft mb-2">
          Tu pedido #{orderNumber} fue confirmado.
        </p>
        <p className="text-morelia-text-soft mb-8">
          Te enviamos un email a {email} con el detalle de tu compra.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--color-button)] text-white px-8 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4">
      <ProgressBar current={step === "entrega" ? 2 : 3} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-20">
        <div>
          {step === "entrega" && (
            <form onSubmit={handleEntregaSubmit} className="space-y-8">
              <div>
                <h2 className="text-sm uppercase tracking-wide text-morelia-text-soft mb-4">
                  Datos de contacto
                </h2>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none mb-3"
                />
                <label className="flex items-center gap-2 text-sm text-morelia-text-soft">
                  <input
                    type="checkbox"
                    checked={wantsOffers}
                    onChange={(e) => setWantsOffers(e.target.checked)}
                  />
                  Quiero recibir ofertas y novedades por e-mail
                </label>
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-wide text-morelia-text-soft mb-4">
                  Entrega
                </h2>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Código Postal"
                  className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
                />
                {postalError && (
                  <p className="text-xs text-morelia-error mt-2">{postalError}</p>
                )}
                <button type="button" className="text-xs underline mt-2 text-morelia-text-soft">
                  No sé mi CP
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--color-button)] text-white py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                Continuar
              </button>
            </form>
          )}

          {step === "pago" && (
            <form onSubmit={handlePagoSubmit} className="space-y-8">
              <div>
                <h2 className="text-sm uppercase tracking-wide text-morelia-text-soft mb-4">
                  Datos de envío
                </h2>
                <div className="space-y-3">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre y apellido"
                    className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
                  />
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle y número"
                    className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
                  />
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ciudad"
                    className="w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-wide text-morelia-text-soft mb-4">
                  Medio de pago
                </h2>
                <div className="space-y-2">
                  {[
                    { value: "tarjeta", label: "Tarjeta de crédito o débito" },
                    { value: "mercadopago", label: "Mercado Pago" },
                    { value: "transferencia", label: "Transferencia bancaria" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 border border-morelia-text/20 px-4 py-3 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-button)] text-white py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? "Procesando..." : `Confirmar compra · ${formatPrice(items.reduce((s, i) => s + i.price * i.qty, 0) + shipping)}`}
              </button>
            </form>
          )}
        </div>

        <OrderSummary items={items} shipping={shipping} />
      </div>
    </main>
  );
}
