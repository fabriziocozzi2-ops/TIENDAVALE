import { readDB } from "@/lib/server/db";
import { Category, Product } from "@/lib/types";

export async function getAllProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await readDB();
  return db.products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const db = await readDB();
  return db.products.filter((p) => p.category === category);
}

export async function getFeaturedHomeProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products.filter((p) => p.featuredHome);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const db = await readDB();
  return db.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await readDB();
  return db.categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await readDB();
  return db.categories.find((c) => c.slug === slug);
}
