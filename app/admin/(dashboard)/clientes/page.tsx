import { readDB } from "@/lib/server/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const db = await readDB();

  const byEmail = new Map<
    string,
    { email: string; name?: string; purchases: number; total: number; lastDate: string }
  >();

  for (const order of db.orders) {
    const existing = byEmail.get(order.customerEmail);
    if (existing) {
      existing.purchases += 1;
      existing.total += order.total;
      if (order.date > existing.lastDate) existing.lastDate = order.date;
    } else {
      byEmail.set(order.customerEmail, {
        email: order.customerEmail,
        name: order.customerName,
        purchases: 1,
        total: order.total,
        lastDate: order.date,
      });
    }
  }

  const customers = Array.from(byEmail.values());

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Clientes</h1>

      {customers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center max-w-lg mx-auto">
          <h2 className="font-serif text-xl mb-2">
            ¡Tu primer cliente llegará pronto!
          </h2>
          <p className="text-sm text-gray-500">
            Acá vas a encontrar los datos de tus clientes una vez que
            realicen su primera compra.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Compras</th>
                <th className="text-left px-4 py-3 font-medium">Total gastado</th>
                <th className="text-left px-4 py-3 font-medium">Última compra</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.email}>
                  <td className="px-4 py-3">{c.name || "—"}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.purchases}</td>
                  <td className="px-4 py-3">{formatPrice(c.total)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.lastDate).toLocaleDateString("es-AR")}
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
