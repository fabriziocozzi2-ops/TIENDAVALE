import Link from "next/link";

export default function BrandMission({
  eyebrow,
  quote,
  linkLabel,
  linkHref,
}: {
  eyebrow: string;
  quote: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest2 text-morelia-text-soft mb-6">
          {eyebrow}
        </p>
        <p className="font-serif italic text-2xl md:text-3xl leading-relaxed mb-6">
          &ldquo;{quote}&rdquo;
        </p>
        <Link href={linkHref} className="text-sm underline underline-offset-4">
          {linkLabel}
        </Link>
      </div>
    </section>
  );
}
