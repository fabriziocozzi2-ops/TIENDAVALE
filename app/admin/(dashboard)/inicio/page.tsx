import { readDB } from "@/lib/server/db";
import { CheckCircle2, TrendingUp, Users, ShoppingBag, LucideIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminInicioPage() {
  const db = await readDB();
  const totalVentas = db.orders.length;
  const facturacion = db.orders.reduce((sum, o) => sum + o.total, 0);
  const clientesUnicos = new Set(db.orders.map((o) => o.customerEmail)).size;

  return (
    <div>
      <h1 className="font-serif text-2xl mb-1">Inicio</h1>
      <p className="text-sm text-gray-500 mb-8">
        ¡Chequeá los pasos para dejar tu tienda a tu manera!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard icon={ShoppingBag} label="Ventas totales" value={String(totalVentas)} />
        <StatCard icon={TrendingUp} label="Facturación" value={formatPrice(facturacion)} />
        <StatCard icon={Users} label="Clientes" value={String(clientesUnicos)} />
      </div>

      <div className="bg-white border border-gray-200 rounded divide-y">
        <ChecklistItem done title="Cuenta validada" description="¡Tu cuenta fue validada!" />
        <ChecklistItem done title="Agregar productos" description={`Tenés ${db.products.length} productos cargados.`} />
        <ChecklistItem done title="Personalizar diseño" description="Definí colores y secciones desde Diseño." />
        <ChecklistItem
          title="Definir punto de partida de los envíos"
          description="Informá la dirección del centro de distribución para calcular costos de envío."
        />
        <ChecklistItem title="Configurar medios de envío" description="Elegí los correos y tarifas disponibles." />
        <ChecklistItem title="Revisar configuraciones de pago" description="Activá los medios de pago para tu tienda." />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <Icon size={18} className="text-gray-400 mb-3" />
      <p className="text-2xl font-medium">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function ChecklistItem({
  title,
  description,
  done = false,
}: {
  title: string;
  description: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <CheckCircle2
        size={18}
        className={done ? "text-green-600" : "text-gray-300"}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {!done && (
        <button className="text-xs bg-[#0070F3] text-white px-3 py-1.5 rounded">
          Definir
        </button>
      )}
    </div>
  );
}
