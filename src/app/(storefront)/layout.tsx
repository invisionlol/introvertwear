import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { getAllCategories } from "@/lib/data";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getAllCategories();

  return (
    <>
      <Navbar categories={categories} />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  );
}
