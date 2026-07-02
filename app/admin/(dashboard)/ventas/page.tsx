import { readDB } from "@/lib/server/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminVentasPage() {
  const db = await readDB();
  const orders = db.orders;

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Ventas</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center max-w-lg mx-auto">
          <h2 className="font-serif text-xl mb-2">
            ¡Tu primera venta está por llegar!
          </h2>
          <p className="text-sm text-gray-500">
            Desde acá vas a gestionar tus ventas y órdenes generadas en la
            tienda online.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 font-medium">N° Pedido</th>
                <th className="text-left px-4 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Pago</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(o.date).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">#{o.number}</td>
                  <td className="px-4 py-3">{o.customerEmail}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 capitalize">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {o.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
