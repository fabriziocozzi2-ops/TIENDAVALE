import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/server/catalog";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryProductGrid from "@/components/sections/CategoryProductGrid";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: { categoria: string };
}) {
  const category = await getCategoryBySlug(params.categoria);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <main>
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: category.name }]} />
      <div className="text-center pt-8 pb-4">
        <h1 className="font-serif text-3xl md:text-4xl">{category.name}</h1>
      </div>
      <CategoryProductGrid products={products} />
    </main>
  );
}
