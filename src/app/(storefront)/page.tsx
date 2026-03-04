import { Suspense } from "react";
import { HeroSection } from "@/components/shop/HeroSection";
import { ProductCard } from "@/components/shop/ProductCard";
import { AnimatedGrid, AnimatedGridItem } from "@/components/shop/AnimatedGrid";
import { getNewArrivals, getActiveCampaigns, getMaxDiscount } from "@/lib/data";

export const metadata = {
  title: "introvertwears",
  description: "Minimal. Intentional. For those who speak softly and dress loudly.",
};

// Allow page to revalidate when admin adds products
export const revalidate = 60;

async function NewArrivals() {
  const [products, campaigns] = await Promise.all([
    getNewArrivals(8),
    getActiveCampaigns(),
  ]);
  const discountPct = getMaxDiscount(campaigns);

  return (
    /* Light section — high contrast against the dark hero above */
    <section
      id="new-arrivals"
      style={{ backgroundColor: "var(--color-surface-light)", borderTop: "1px solid var(--color-surface-light-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-2"
              style={{ color: "oklch(0.54 0.022 58)" }}
            >
              Just dropped
            </p>
            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "oklch(0.10 0.012 50)" }}
            >
              New Arrivals
            </h2>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: "oklch(0.54 0.022 58)" }}>
            Check back soon — new pieces are on the way.
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
    </section>
  );
}

async function CampaignsBanner() {
  const campaigns = await getActiveCampaigns();
  if (!campaigns.length) return null;

  return (
    <section className="grain bg-card border-t border-border py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-2">
          Limited time
        </p>
        <h2 className="text-2xl font-semibold tracking-tight mb-10">
          Active Promotions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-card p-8 space-y-3">
              {/* Caramel accent on the percentage */}
              <p
                className="text-5xl font-semibold tracking-tighter"
                style={{ color: "var(--color-accent)" }}
              >
                {c.discountPercentage}%
              </p>
              <p className="text-sm font-medium tracking-tight text-foreground">{c.name}</p>
              {c.validUntil && (
                <p className="text-xs text-muted-foreground tracking-wide">
                  Until{" "}
                  {new Date(c.validUntil).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <p className="text-xs text-muted-foreground tracking-widest uppercase pt-1">
                Applied automatically at checkout
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="h-96" />}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={null}>
        <CampaignsBanner />
      </Suspense>
    </>
  );
}
