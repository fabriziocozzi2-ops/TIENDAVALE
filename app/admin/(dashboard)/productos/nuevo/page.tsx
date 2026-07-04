import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { readDB } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const db = await readDB();

  return (
    <div>
      <Link href="/admin/productos" className="text-xs text-gray-500 mb-4 inline-block">
        ← Volver
      </Link>
      <h1 className="font-serif text-2xl mb-6">Nuevo producto</h1>
      <ProductForm categories={db.categories} />
    </div>
  );
}
