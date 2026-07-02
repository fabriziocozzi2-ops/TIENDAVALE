# Morelia Accesorios

Tienda e-commerce inspirada en el diseño de Tiendanube, con tienda pública y
panel de administración, construida con Next.js 14 (App Router), TypeScript,
Tailwind CSS y Zustand.

## Getting started

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para la tienda.

Abrí [http://localhost:3000/admin](http://localhost:3000/admin) para el panel
de administración. Contraseña por defecto: `morelia2026` (configurable con la
variable de entorno `ADMIN_PASSWORD`).

## Estructura

- `app/(store)`: tienda pública (home, categorías, producto, carrito, checkout).
- `app/admin`: panel de administración (productos, ventas, clientes, cupones, diseño).
- `app/api`: rutas de API (órdenes, productos, cupones, tema, login admin).
- `lib/server/db.ts`: almacenamiento de datos en `data/db.json` (se crea
  automáticamente en el primer uso, no se versiona en git).
- `lib/data`: catálogo mock inicial (semilla de `data/db.json`).

## Notas

- El carrito se persiste en `localStorage` del navegador.
- Los cambios hechos en `/admin/productos` y `/admin/diseno` se reflejan al
  instante en la tienda pública (leen y escriben el mismo `data/db.json`).
- El checkout es una simulación (no procesa pagos reales); al confirmar la
  compra se crea una orden que aparece en `/admin/ventas`.
- Las imágenes de producto son placeholders ilustrativos por categoría; para
  producción, reemplazá `components/ui/ProductImage.tsx` por fotos reales.
