import Breadcrumb from "@/components/ui/Breadcrumb";

const faqs = [
  {
    q: "¿Cuáles son los medios de pago disponibles?",
    a: "Aceptamos tarjetas de crédito y débito, Mercado Pago y transferencia bancaria. Podés elegir el medio de pago en el paso final del checkout.",
  },
  {
    q: "¿Cuánto tarda el envío?",
    a: "Los envíos con código postal válido suelen demorar entre 3 y 5 días hábiles. El costo se calcula automáticamente desde el carrito según tu código postal.",
  },
  {
    q: "¿Puedo personalizar un producto?",
    a: "Sí, algunos productos cuentan con opciones de personalización (colores, charms, grabados, extras) que vas a ver directamente en la ficha del producto, con el costo adicional de cada elección.",
  },
  {
    q: "¿Puedo cambiar o devolver un producto?",
    a: "Sí, tenés hasta 10 días desde la recepción del pedido para solicitar un cambio o devolución. Escribinos por WhatsApp o email para coordinarlo.",
  },
  {
    q: "¿Los productos son de cuero genuino?",
    a: "Todos nuestros productos están confeccionados en cuero ecológico, libre de origen animal.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Preguntas frecuentes" }]} />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl md:text-4xl mb-10 text-center">
          Preguntas frecuentes
        </h1>
        <div className="divide-y divide-morelia-text/10">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-6">
              <h2 className="text-sm font-medium mb-2">{faq.q}</h2>
              <p className="text-sm text-morelia-text-soft leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
