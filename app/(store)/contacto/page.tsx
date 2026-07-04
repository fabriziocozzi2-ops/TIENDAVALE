import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ContactoPage() {
  return (
    <main>
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-3xl md:text-4xl mb-6">Contacto</h1>
        <p className="text-morelia-text-soft mb-10">
          ¿Tenés dudas sobre un producto, un pedido o querés hacernos una
          consulta? Escribinos por cualquiera de estos medios.
        </p>
        <div className="space-y-3 text-sm">
          <p>
            <span className="text-morelia-text-soft">Teléfono: </span>
            541111111
          </p>
          <p>
            <span className="text-morelia-text-soft">WhatsApp: </span>
            +5491132909
          </p>
          <p>
            <span className="text-morelia-text-soft">Email: </span>
            <a href="mailto:info@dsaccesorios.com" className="underline">
              info@dsaccesorios.com
            </a>
          </p>
          <p>
            <span className="text-morelia-text-soft">Dirección: </span>
            4105 Av Libertador
          </p>
        </div>
      </div>
    </main>
  );
}
