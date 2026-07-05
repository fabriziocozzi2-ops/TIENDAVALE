"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlideContent } from "@/lib/server/db";

const fallbackGradients = [
  "from-[#2b2118] via-[#1c150f] to-[#0a0806]",
  "from-[#241c1c] via-[#171212] to-[#080606]",
];

export default function HeroSlider({ slides }: { slides: HeroSlideContent[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index % slides.length];

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
            </>
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                fallbackGradients[i % fallbackGradients.length]
              }`}
            />
          )}
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center text-white pb-16 px-4">
        <h1 className="font-serif text-4xl md:text-6xl mb-4">{slide.title}</h1>
        <p className="text-sm md:text-base text-white/80 max-w-md mb-4">
          {slide.subtitle}
        </p>
        <Link href={slide.ctaHref} className="text-sm underline underline-offset-4">
          {slide.ctaLabel}
        </Link>

        {slides.length > 1 && (
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
        )}
      </div>
    </section>
  );
}
