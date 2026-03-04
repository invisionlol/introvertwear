import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import {
  getProductById,
  getActiveCampaigns,
  getMaxDiscount,
  applyDiscount,
} from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return {};
  return {
    title: product.title,
    description: product.description ?? `Shop ${product.title} at introvertwears`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const [product, campaigns] = await Promise.all([
    getProductById(Number(id)),
    getActiveCampaigns(),
  ]);

  if (!product) notFound();

  const discountPct = getMaxDiscount(campaigns);
  const discountedPrice = discountPct > 0 ? applyDiscount(product.price, discountPct) : null;
  const outOfStock = product.stock <= 0;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-surface-light)" }}
    >
    <div className="pt-20 pb-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-start">
        {/* LEFT — Image Gallery */}
        <ImageGallery images={product.images} title={product.title} />

        {/* RIGHT — Product Info */}
        <div className="md:sticky md:top-24 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.title}</span>
          </div>

          {/* Title + Price */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-2xl text-destructive font-medium">
                    ฿{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-base text-muted-foreground line-through">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs bg-foreground text-background px-2 py-0.5 tracking-widest uppercase">
                    -{discountPct}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-medium">
                  ฿{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                outOfStock ? "bg-destructive" : "bg-green-500"
              }`}
            />
            <span className="text-xs text-muted-foreground tracking-wide">
              {outOfStock
                ? "Out of stock"
                : product.stock <= 5
                ? `Only ${product.stock} left`
                : "In stock"}
            </span>
          </div>

          {/* CTA */}
          <AddToCartButton product={product} discountedPrice={discountedPrice} />

          {/* Campaign note */}
          {discountPct > 0 && !outOfStock && (
            <p className="text-xs text-muted-foreground text-center tracking-wide">
              {campaigns[0]?.name} — discount applied automatically
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
