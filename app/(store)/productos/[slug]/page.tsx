import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/server/catalog";
import { getCategoryBySlug } from "@/lib/data/categories";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductDetail from "@/components/sections/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = await getRelatedProducts(product);

  return (
    <main>
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: category?.name ?? product.category, href: `/${product.category}` },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} related={related} />
    </main>
  );
}
