import { Eye, Home, Recycle } from "lucide-react";

const items = [
  {
    icon: Eye,
    title: "Nosotros",
    text: "Nuestra misión es crear productos de alta calidad que reflejen la artesanía tradicional y el lujo contemporáneo.",
  },
  {
    icon: Home,
    title: "Locales",
    text: "Tenemos 5 locales alrededor de todo el país, para que todos puedan acceder a nuestros productos.",
  },
  {
    icon: Recycle,
    title: "Reciclados",
    text: "Nuestros productos están 100% reciclados, son amables con el medio ambiente y los procesos productivos.",
  },
];

export default function IconInfo() {
  return (
    <section className="py-20 px-4 bg-morelia-bg-alt">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {items.map((item) => (
          <div key={item.title}>
            <item.icon size={40} strokeWidth={1} className="mx-auto mb-4" />
            <h3 className="font-serif text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-morelia-text-soft leading-relaxed max-w-xs mx-auto">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
