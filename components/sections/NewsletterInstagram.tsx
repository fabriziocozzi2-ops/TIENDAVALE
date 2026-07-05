"use client";

import { useState } from "react";

export default function NewsletterInstagram({
  title,
  instagramHandle,
  instagramHref,
}: {
  title: string;
  instagramHandle: string;
  instagramHref: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section className="py-20 px-4 text-center">
      <h2 className="font-serif text-2xl md:text-3xl mb-6">{title}</h2>
      {submitted ? (
        <p className="text-sm text-[var(--color-accent)]">
          ¡Gracias por suscribirte!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email..."
            className="flex-1 w-full border border-morelia-text/20 px-4 py-3 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[var(--color-button)] text-white px-6 py-3 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            Suscribirme
          </button>
        </form>
      )}

      <div className="mt-14">
        <p className="text-sm text-morelia-text-soft mb-1">{instagramHandle}</p>
        <a href={instagramHref} className="text-sm underline underline-offset-4">
          Ver perfil
        </a>
      </div>
    </section>
  );
}
