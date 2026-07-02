import { Watch, ShoppingBag, Wallet, Briefcase } from "lucide-react";
import { CategorySlug } from "@/lib/types";

const ICONS: Record<CategorySlug, React.ComponentType<{ className?: string }>> = {
  relojes: Watch,
  bolsos: ShoppingBag,
  billeteras: Wallet,
  estuches: Briefcase,
  cinturones: BeltIcon,
};

function BeltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <rect x="2" y="9" width="20" height="6" rx="1" />
      <circle cx="12" cy="12" r="2" />
      <path d="M2 12h2M20 12h2" />
    </svg>
  );
}

function keyToCategory(key: string): CategorySlug {
  const cat = key.split("-")[0] as CategorySlug;
  if (cat in ICONS) return cat;
  return "bolsos";
}

export default function ProductImage({
  image,
  alt,
  className = "",
}: {
  image: string;
  alt: string;
  className?: string;
}) {
  const category = keyToCategory(image);
  const Icon = ICONS[category];
  return (
    <div
      className={`relative flex items-center justify-center bg-morelia-card overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      <Icon className="w-1/3 h-1/3 text-morelia-text/25" />
    </div>
  );
}
