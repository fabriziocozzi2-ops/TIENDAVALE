import Link from "next/link";

export default function BrandMission() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest2 text-morelia-text-soft mb-6">
          Nuestros productos
        </p>
        <p className="font-serif italic text-2xl md:text-3xl leading-relaxed mb-6">
          &ldquo;Nuestra misión es ofrecer objetos de alta calidad que sean
          completamente libres de productos de origen animal, sin
          comprometer el estilo ni el respeto por los animales.&rdquo;
        </p>
        <Link href="/nosotros" className="text-sm underline underline-offset-4">
          Conocer más
        </Link>
      </div>
    </section>
  );
}
