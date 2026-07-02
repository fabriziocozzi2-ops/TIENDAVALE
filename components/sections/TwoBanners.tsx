import Link from "next/link";

const banners = [
  {
    title: "Inspirate en la nueva colección",
    href: "/bolsos",
    gradient: "from-[#3a2f22] to-[#0f0b08]",
  },
  {
    title: "Todos nuestros materiales son eco friendly",
    href: "/relojes",
    gradient: "from-[#241f1c] to-[#0a0806]",
  },
];

export default function TwoBanners() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {banners.map((b) => (
        <div
          key={b.title}
          className={`relative h-72 md:h-96 flex items-center justify-center bg-gradient-to-br ${b.gradient} text-white text-center px-6`}
        >
          <div>
            <p className="font-serif text-2xl md:text-3xl mb-4 max-w-xs">
              {b.title}
            </p>
            <Link href={b.href} className="text-sm underline underline-offset-4">
              Comprar
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
