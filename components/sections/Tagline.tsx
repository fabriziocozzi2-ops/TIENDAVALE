export default function Tagline({ text }: { text: string }) {
  return (
    <section className="py-16 md:py-20 px-4">
      <p className="max-w-2xl mx-auto text-center italic text-lg md:text-xl text-morelia-text/80 leading-relaxed">
        {text}
      </p>
    </section>
  );
}
