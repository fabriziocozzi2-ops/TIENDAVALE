import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/server/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const db = await readDB();
  const product = db.products.find((p) => p.id === Number(params.id));
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/productos" className="text-xs text-gray-500 mb-4 inline-block">
        ← Volver
      </Link>
      <h1 className="font-serif text-2xl mb-6">{product.name}</h1>
      <ProductForm product={product} categories={db.categories} />
    </div>
  );
}
