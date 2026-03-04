import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { AnimatedGrid, AnimatedGridItem } from "@/components/shop/AnimatedGrid";
import { getProductsByCategory, getActiveCampaigns, getMaxDiscount } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getProductsByCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Shop ${category.name} at introvertwears`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [{ category, products }, campaigns] = await Promise.all([
    getProductsByCategory(slug),
    getActiveCampaigns(),
  ]);

  if (!category) notFound();

  const discountPct = getMaxDiscount(campaigns);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-surface-light)" }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div
          className="mb-16 pb-8"
          style={{ borderBottom: "1px solid var(--color-surface-light-border)" }}
        >
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-2"
            style={{ color: "oklch(0.54 0.022 58)" }}
          >
            Collection
          </p>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "oklch(0.10 0.012 50)" }}
          >
            {category.name}
          </h1>
          <p className="text-sm mt-2" style={{ color: "oklch(0.54 0.022 58)" }}>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-sm py-20 text-center" style={{ color: "oklch(0.54 0.022 58)" }}>
            No pieces here yet. Check back soon.
          </p>
        ) : (
          <AnimatedGrid>
            {products.map((product, i) => (
              <AnimatedGridItem key={product.id} index={i}>
                <ProductCard product={product} discountPct={discountPct} light />
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        )}
      </div>
    </div>
  );
}
