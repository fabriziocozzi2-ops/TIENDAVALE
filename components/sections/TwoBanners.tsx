import Link from "next/link";
import { BannerContent } from "@/lib/server/db";

const fallbackGradients = [
  "from-[#3a2f22] to-[#0f0b08]",
  "from-[#241f1c] to-[#0a0806]",
];

export default function TwoBanners({ banners }: { banners: BannerContent[] }) {
  if (banners.length === 0) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {banners.map((b, i) => (
        <div
          key={i}
          className={`relative h-72 md:h-96 flex items-center justify-center text-white text-center px-6 overflow-hidden ${
            !b.image ? `bg-gradient-to-br ${fallbackGradients[i % fallbackGradients.length]}` : ""
          }`}
        >
          {b.image && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
            </>
          )}
          <div className="relative z-10">
            <p className="font-serif text-2xl md:text-3xl mb-4 max-w-xs mx-auto">{b.title}</p>
            <Link href={b.href} className="text-sm underline underline-offset-4">
              Comprar
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
