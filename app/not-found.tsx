import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-4xl mb-4">Error - 404</h1>
      <p className="text-morelia-text-soft mb-8">
        La página que estás buscando no existe.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Volver a la tienda
      </Link>
    </main>
  );
}
