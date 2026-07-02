import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-8xl mx-auto">
      <h2 className="text-center font-serif text-3xl md:text-4xl mb-4">
        Los más elegidos
      </h2>
      <div className="w-16 h-px bg-morelia-text/30 mx-auto mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
