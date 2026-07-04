import Link from "next/link";
import { InstagramIcon, FacebookIcon, YoutubeIcon, XIcon } from "@/components/ui/SocialIcons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-morelia-bg-footer text-white/80">
      <div className="max-w-8xl mx-auto px-4 py-16">
        <div className="flex justify-center gap-5 mb-12">
          {[InstagramIcon, FacebookIcon, YoutubeIcon, XIcon].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:border-white/60 hover:text-white transition-colors"
              aria-label="Red social"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm mb-12">
          <div>
            <h3 className="text-white font-medium mb-4">Nosotros</h3>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Sobre la marca
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Cómo comprar</h3>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link href="/como-comprar" className="hover:text-white transition-colors">
                  Medios de pago
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/cambios-y-devoluciones" className="hover:text-white transition-colors">
                  Cambios y devoluciones
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2 text-white/60">
            <h3 className="text-white font-medium mb-4">Contacto</h3>
            <p>541111111</p>
            <p>+5491132909</p>
            <p>info@dsaccesorios.com</p>
            <p>4105 Av Libertador</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-xs text-white/40 flex flex-col items-center gap-2 text-center">
          <p>
            Copyright DS - {year}. Todos los derechos
            reservados.
          </p>
          <p>
            Defensa de las y los consumidores. Para reclamos ingresá{" "}
            <Link href="/reclamos" className="underline hover:text-white/70">
              acá
            </Link>
            . <Link href="/arrepentimiento" className="underline hover:text-white/70">Botón de arrepentimiento</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
