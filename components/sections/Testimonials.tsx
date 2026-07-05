import { TestimonialContent } from "@/lib/server/db";

export default function Testimonials({ testimonials }: { testimonials: TestimonialContent[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-morelia-bg-alt">
      <h2 className="text-center font-serif text-3xl mb-10">Nuestros clientes</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {testimonials.slice(0, 3).map((t, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 rounded-full bg-morelia-card mx-auto mb-6 overflow-hidden">
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="italic text-morelia-text/80 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
            <p className="text-sm font-medium">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
