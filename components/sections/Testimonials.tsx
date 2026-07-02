import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  const t = testimonials[0];
  return (
    <section className="py-20 px-4 bg-morelia-bg-alt">
      <h2 className="text-center font-serif text-3xl mb-10">
        Nuestros clientes
      </h2>
      <div className="max-w-xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-morelia-card mx-auto mb-6" />
        <p className="italic text-morelia-text/80 leading-relaxed mb-4">
          &ldquo;{t.text}&rdquo;
        </p>
        <p className="text-sm font-medium">{t.name}</p>
      </div>
    </section>
  );
}
