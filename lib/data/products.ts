import { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: 1,
    name: "Mochila Austria",
    slug: "mochila-austria",
    price: 55500,
    originalPrice: null,
    discount: null,
    category: "bolsos",
    freeShipping: true,
    images: ["bolsos-1", "bolsos-2"],
    description:
      "Mochila de cuero ecológico confeccionada a mano, pensada para el uso diario. Amplio compartimento principal, bolsillo interior con cierre y correas ajustables acolchadas.",
    featuredHome: true,
    stock: null,
    sku: "MOC-AUS-001",
  },
  {
    id: 2,
    name: "Billetera Francia",
    slug: "billetera-francia",
    price: 12900,
    originalPrice: null,
    discount: null,
    category: "billeteras",
    freeShipping: true,
    images: ["billeteras-1", "billeteras-2"],
    description:
      "Billetera compacta de cuero ecológico con múltiples divisiones para tarjetas, billetes y documentos. Terminaciones prolijas y costuras reforzadas.",
    featuredHome: true,
    stock: null,
    sku: "BIL-FRA-002",
  },
  {
    id: 3,
    name: "Riñonera Varsovia",
    slug: "rinonera-varsovia",
    price: 25900,
    originalPrice: null,
    discount: null,
    category: "bolsos",
    freeShipping: true,
    images: ["bolsos-3", "bolsos-4"],
    description:
      "Riñonera de cuero ecológico ideal para el día a día. Cierre de cremallera, correa regulable y bolsillo frontal para objetos pequeños.",
    featuredHome: true,
    stock: null,
    sku: "RIN-VAR-003",
  },
  {
    id: 4,
    name: "Cinturón Kentucky",
    slug: "cinturon-kentucky",
    price: 7200,
    originalPrice: null,
    discount: null,
    category: "cinturones",
    freeShipping: false,
    images: ["cinturones-1", "cinturones-2"],
    description:
      "Cinturón de cuero ecológico con hebilla metálica clásica. Disponible en varios talles, combina con looks formales e informales.",
    featuredHome: true,
    stock: 12,
    sku: "CIN-KEN-004",
  },
  {
    id: 5,
    name: "Reloj Bonn",
    slug: "reloj-bonn",
    price: 10500,
    originalPrice: 11500,
    discount: 9,
    category: "relojes",
    freeShipping: true,
    images: ["relojes-1", "relojes-2"],
    description:
      "La pulsera de cuero ecológico utilizada en este reloj está elaborada con materiales sostenibles de alta calidad, combinando diseño atemporal con una mecánica precisa. Resistente al agua y con garantía de un año.",
    featuredHome: true,
    stock: 8,
    sku: "REL-BON-005",
  },
  {
    id: 6,
    name: "Mochila Paris",
    slug: "mochila-paris",
    price: 35500,
    originalPrice: null,
    discount: null,
    category: "bolsos",
    freeShipping: true,
    images: ["bolsos-5", "bolsos-6"],
    description:
      "Mochila urbana de cuero ecológico con diseño minimalista. Compartimento acolchado para notebook y bolsillos laterales.",
    featuredHome: true,
    stock: null,
    sku: "MOC-PAR-006",
  },
  {
    id: 7,
    name: "Morral Indiana",
    slug: "morral-indiana",
    price: 21500,
    originalPrice: null,
    discount: null,
    category: "bolsos",
    freeShipping: true,
    images: ["bolsos-7", "bolsos-8", "bolsos-9"],
    description:
      "Descubrí la fusión perfecta entre estilo y sostenibilidad con nuestro morral de cuero ecológico marrón. Ideal para el uso diario, con capacidad para tus objetos esenciales y un diseño atemporal que combina con cualquier outfit.",
    featuredHome: false,
    stock: null,
    sku: "MOR-IND-007",
  },
  {
    id: 8,
    name: "Reloj Zurich",
    slug: "reloj-zurich",
    price: 13200,
    originalPrice: null,
    discount: null,
    category: "relojes",
    freeShipping: true,
    images: ["relojes-3", "relojes-4"],
    description:
      "Reloj de diseño clásico con correa de cuero ecológico marrón oscuro y caja de acero inoxidable.",
    stock: 5,
    sku: "REL-ZUR-008",
  },
  {
    id: 9,
    name: "Billetera Milán",
    slug: "billetera-milan",
    price: 9800,
    originalPrice: null,
    discount: null,
    category: "billeteras",
    freeShipping: false,
    images: ["billeteras-3", "billeteras-4"],
    description:
      "Billetera plegable de perfil delgado, con espacio para 8 tarjetas y compartimento para monedas.",
    stock: 20,
    sku: "BIL-MIL-009",
  },
  {
    id: 10,
    name: "Cinturón Roma",
    slug: "cinturon-roma",
    price: 6800,
    originalPrice: 7800,
    discount: 13,
    category: "cinturones",
    freeShipping: false,
    images: ["cinturones-3", "cinturones-4"],
    description:
      "Cinturón reversible negro/marrón, hebilla intercambiable y cuero de primera calidad.",
    stock: 15,
    sku: "CIN-ROM-010",
  },
  {
    id: 11,
    name: "Estuche Berlin",
    slug: "estuche-berlin",
    price: 8400,
    originalPrice: null,
    discount: null,
    category: "estuches",
    freeShipping: true,
    images: ["estuches-1", "estuches-2"],
    description:
      "Estuche organizador de cuero ecológico para lentes o accesorios pequeños, con cierre magnético.",
    stock: 10,
    sku: "EST-BER-011",
  },
  {
    id: 12,
    name: "Estuche Praga",
    slug: "estuche-praga",
    price: 6200,
    originalPrice: null,
    discount: null,
    category: "estuches",
    freeShipping: false,
    images: ["estuches-3", "estuches-4"],
    description:
      "Estuche compacto ideal para auriculares y cables, con interior acolchado.",
    stock: 18,
    sku: "EST-PRA-012",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getFeaturedHomeProducts() {
  return products.filter((p) => p.featuredHome);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}
