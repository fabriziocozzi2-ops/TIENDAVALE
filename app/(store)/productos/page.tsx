import { getAllProducts } from "@/lib/server/catalog";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryProductGrid from "@/components/sections/CategoryProductGrid";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <main>
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Productos" }]} />
      <div className="text-center pt-8 pb-4">
        <h1 className="font-serif text-3xl md:text-4xl">Productos</h1>
      </div>
      <CategoryProductGrid products={products} />
    </main>
  );
}
