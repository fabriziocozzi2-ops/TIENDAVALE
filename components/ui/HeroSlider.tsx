"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    title: "Distinción",
    subtitle: "Un toque sofisticado para tus objetos del día a día",
    ctaLabel: "Comprar",
    ctaHref: "/billeteras",
    gradient: "from-[#2b2118] via-[#1c150f] to-[#0a0806]",
  },
  {
    title: "100% Cuero",
    subtitle:
      "Todos nuestros productos están confeccionados en cuero ecológico.",
    ctaLabel: "Comprar",
    ctaHref: "/bolsos",
    gradient: "from-[#241c1c] via-[#171212] to-[#080606]",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[index];

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${s.gradient} transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center text-white pb-16 px-4">
        <h1 className="font-serif text-4xl md:text-6xl mb-4">{slide.title}</h1>
        <p className="text-sm md:text-base text-white/80 max-w-md mb-4">
          {slide.subtitle}
        </p>
        <Link href={slide.ctaHref} className="text-sm underline underline-offset-4">
          {slide.ctaLabel}
        </Link>

        <div className="mt-8 flex items-center gap-4 text-white/70 text-sm">
          <button onClick={prev} aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <span>
            {index + 1} / {slides.length}
          </span>
          <button onClick={next} aria-label="Siguiente">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
