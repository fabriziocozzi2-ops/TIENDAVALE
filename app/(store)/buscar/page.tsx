import { getAllProducts } from "@/lib/server/catalog";
import ProductCard from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").toLowerCase().trim();
  const products = await getAllProducts();
  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    : [];

  return (
    <main className="max-w-8xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-center mb-2">
        Resultados para &ldquo;{query}&rdquo;
      </h1>
      <p className="text-center text-sm text-morelia-text-soft mb-10">
        {results.length} producto{results.length !== 1 && "s"} encontrado
        {results.length !== 1 && "s"}
      </p>
      {results.length === 0 ? (
        <p className="text-center text-sm text-morelia-text-soft py-16">
          No encontramos productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
