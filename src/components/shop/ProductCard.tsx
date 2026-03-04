import Link from "next/link";
import { ImageOff } from "lucide-react";
import { applyDiscount } from "@/lib/data";
import type { Product, Category } from "@/lib/db/schema";

interface ProductCardProps {
  product: Product & { category: Category | null };
  discountPct?: number;
  /** Pass true when card sits on a light/white background */
  light?: boolean;
}

export function ProductCard({ product, discountPct = 0, light = false }: ProductCardProps) {
  const discounted = discountPct > 0 ? applyDiscount(product.price, discountPct) : null;
  const outOfStock = product.stock <= 0;

  // On light bg use dark ink colours; on dark bg use the CSS vars (cream)
  const titleColor  = light ? "oklch(0.12 0.012 50)" : undefined; // near-black
  const priceColor  = light ? "oklch(0.35 0.015 50)" : undefined; // dark warm gray
  const imageEmptyBg = light ? "oklch(0.91 0.010 70)" : undefined; // warm light gray

  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ backgroundColor: imageEmptyBg ?? "var(--color-muted)" }}
      >
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={20} className="opacity-25" strokeWidth={1} />
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: light ? "oklch(0.97 0.008 75 / 0.7)" : "oklch(0.10 0.012 50 / 0.6)" }}
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: light ? "oklch(0.40 0.015 50)" : "var(--color-muted-foreground)" }}
            >
              Sold Out
            </span>
          </div>
        )}

        {/* Campaign badge — caramel accent */}
        {discountPct > 0 && !outOfStock && (
          <div
            className="absolute top-3 left-3 text-[9px] tracking-widest uppercase px-2 py-1"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
            }}
          >
            -{discountPct}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 space-y-0.5">
        <p
          className="text-sm tracking-tight leading-snug"
          style={{ color: titleColor }}
        >
          {product.title}
        </p>
        <div className="flex items-baseline gap-2">
          {discounted ? (
            <>
              <span className="text-sm text-destructive">
                ฿{discounted.toLocaleString()}
              </span>
              <span
                className="text-xs line-through"
                style={{ color: priceColor ?? "var(--color-muted-foreground)" }}
              >
                ฿{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span
              className="text-sm"
              style={{ color: priceColor ?? "var(--color-muted-foreground)" }}
            >
              ฿{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
