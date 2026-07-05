import { readDB } from "@/lib/server/db";
import { getFeaturedHomeProducts, getAllProducts } from "@/lib/server/catalog";
import HeroSlider from "@/components/ui/HeroSlider";
import Tagline from "@/components/sections/Tagline";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoryShowcase from "@/components/sections/CategoryShowcase";
import BrandMission from "@/components/sections/BrandMission";
import FeaturedProductDetail from "@/components/sections/FeaturedProductDetail";
import TwoBanners from "@/components/sections/TwoBanners";
import Testimonials from "@/components/sections/Testimonials";
import HandmadeHero from "@/components/sections/HandmadeHero";
import IconInfo from "@/components/sections/IconInfo";
import NewsletterInstagram from "@/components/sections/NewsletterInstagram";

export const dynamic = "force-dynamic";

export default async function Home() {
  const db = await readDB();
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedHomeProducts(),
    getAllProducts(),
  ]);
  const content = db.theme.content;
  const featuredProduct =
    allProducts.find((p) => p.id === content.featuredDetail.productId) ??
    allProducts[0];

  const visibleIds = new Set(
    db.theme.homepage.sections.filter((s) => s.visible).map((s) => s.id)
  );
  const order = db.theme.homepage.sections.map((s) => s.id);

  const sections: Record<string, React.ReactNode> = {
    welcome: <Tagline key="welcome" text={content.welcome.text} />,
    slider: <HeroSlider key="slider" slides={content.slider.slides} />,
    featured: (
      <FeaturedProducts key="featured" products={featuredProducts} title={content.featured.title} />
    ),
    categories: <CategoryShowcase key="categories" categories={db.categories} />,
    mission: <BrandMission key="mission" {...content.mission} />,
    featuredDetail: featuredProduct ? (
      <FeaturedProductDetail key="featuredDetail" product={featuredProduct} />
    ) : null,
    banners: <TwoBanners key="banners" banners={content.banners} />,
    testimonials: <Testimonials key="testimonials" testimonials={content.testimonials} />,
    handmade: <HandmadeHero key="handmade" {...content.handmade} />,
    iconInfo: <IconInfo key="iconInfo" items={content.iconInfo} />,
    newsletter: <NewsletterInstagram key="newsletter" {...content.newsletter} />,
  };

  return (
    <main>
      {order.filter((id) => visibleIds.has(id)).map((id) => sections[id])}
    </main>
  );
}
