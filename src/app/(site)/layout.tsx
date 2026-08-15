import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getCartCount } from "@/lib/cart";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartCount();

  return (
    <div className="min-h-screen overflow-x-clip relative">
      <Header cartCount={cartCount} />
      {children}
      <Footer />
    </div>
  );
}
