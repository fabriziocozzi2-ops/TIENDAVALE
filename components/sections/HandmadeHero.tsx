export default function HandmadeHero({
  title,
  text,
  image,
}: {
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <section
      className={`relative h-80 md:h-[28rem] flex items-center px-6 md:px-20 overflow-hidden ${
        !image ? "bg-gradient-to-br from-[#2a2018] to-[#080604]" : ""
      }`}
    >
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="relative z-10 text-white max-w-sm">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">{title}</h2>
        <p className="text-sm md:text-base text-white/75 leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
