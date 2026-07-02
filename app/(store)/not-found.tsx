import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";

export default function NotFound() {
  const suggested = products.slice(0, 4);

  return (
    <main className="max-w-8xl mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-4xl mb-4">Error - 404</h1>
      <p className="text-morelia-text-soft mb-2">
        La página que estás buscando no existe.
      </p>
      <p className="text-morelia-text-soft mb-12">
        Quizás te interesen los siguientes productos.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-left">
        {suggested.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
