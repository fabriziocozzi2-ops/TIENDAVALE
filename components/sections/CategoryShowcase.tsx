import Link from "next/link";
import { Category } from "@/lib/types";
import ProductImage from "@/components/ui/ProductImage";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 px-4 max-w-8xl mx-auto">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="relative shrink-0 w-64 h-44 group overflow-hidden"
          >
            <ProductImage
              image={`${cat.slug}-1`}
              alt={cat.name}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white font-medium tracking-wide uppercase text-sm">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
