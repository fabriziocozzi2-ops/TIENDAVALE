import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/productos" className="text-xs text-gray-500 mb-4 inline-block">
        ← Volver
      </Link>
      <h1 className="font-serif text-2xl mb-6">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
