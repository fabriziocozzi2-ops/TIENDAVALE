# Morelia Accesorios

Tienda e-commerce inspirada en el diseño de Tiendanube, con tienda pública y
panel de administración, construida con Next.js 14 (App Router), TypeScript,
Tailwind CSS y Zustand.

## Getting started

```bash
npm install
cp .env.example .env.local # completá SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para la tienda.

Abrí [http://localhost:3000/admin](http://localhost:3000/admin) para el panel
de administración. Contraseña por defecto: `morelia2026` (configurable con la
variable de entorno `ADMIN_PASSWORD`).

## Base de datos

Los datos (productos, órdenes, cupones, configuración de diseño) se guardan en
Supabase (Postgres). Variables de entorno requeridas (ver `.env.example`):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API en supabase.com; nunca
  se expone al cliente, solo se usa en el servidor)

## Estructura

- `app/(store)`: tienda pública (home, categorías, producto, carrito, checkout).
- `app/admin`: panel de administración (productos, ventas, clientes, cupones, diseño).
- `app/api`: rutas de API (órdenes, productos, cupones, tema, login admin).
- `lib/server/supabase.ts`: cliente de Supabase (server-only).
- `lib/server/db.ts`: capa de acceso a datos (`readDB`/`writeDB`) sobre las
  tablas `products`, `orders`, `coupons` y `app_state` de Supabase.
- `lib/data`: catálogo mock inicial (semilla de la tabla `products`).

## Notas

- El carrito se persiste en `localStorage` del navegador.
- Los cambios hechos en `/admin/productos` y `/admin/diseno` se reflejan al
  instante en la tienda pública (misma base de datos).
- El checkout es una simulación (no procesa pagos reales); al confirmar la
  compra se crea una orden que aparece en `/admin/ventas`.
- Las imágenes de producto son placeholders ilustrativos por categoría; para
  producción, reemplazá `components/ui/ProductImage.tsx` por fotos reales.
