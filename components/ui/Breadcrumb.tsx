import Link from "next/link";

export default function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="text-xs text-morelia-text-soft px-4 max-w-8xl mx-auto pt-6">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} className="hover:text-morelia-text transition-colors">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {i < items.length - 1 && <span className="mx-1.5">.</span>}
        </span>
      ))}
    </div>
  );
}
