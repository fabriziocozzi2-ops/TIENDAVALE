import { Eye, Home, Recycle } from "lucide-react";

const icons = [Eye, Home, Recycle];

export default function IconInfo({ items }: { items: { title: string; text: string }[] }) {
  return (
    <section className="py-20 px-4 bg-morelia-bg-alt">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i}>
              <Icon size={40} strokeWidth={1} className="mx-auto mb-4" />
              <h3 className="font-serif text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-morelia-text-soft leading-relaxed max-w-xs mx-auto">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
