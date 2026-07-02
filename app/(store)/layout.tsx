import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookiesBanner from "@/components/layout/CookiesBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CartDrawer from "@/components/ui/CartDrawer";
import CartToast from "@/components/ui/CartToast";
import { readDB } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await readDB();
  const { colors } = db.theme;

  return (
    <div
      style={
        {
          "--color-bg": colors.background,
          "--color-text": colors.text,
          "--color-accent": colors.accent,
          "--color-button": colors.button,
        } as React.CSSProperties
      }
    >
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <CartToast />
      <CookiesBanner />
      <WhatsAppButton />
    </div>
  );
}
