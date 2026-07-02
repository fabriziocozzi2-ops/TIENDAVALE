import { Category } from "@/lib/types";

export const categories: Category[] = [
  { slug: "relojes", name: "Relojes", image: "relojes" },
  { slug: "bolsos", name: "Bolsos", image: "bolsos" },
  { slug: "cinturones", name: "Cinturones", image: "cinturones" },
  { slug: "billeteras", name: "Billeteras", image: "billeteras" },
  { slug: "estuches", name: "Estuches", image: "estuches" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
