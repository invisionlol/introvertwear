"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/db/schema";

interface AddToCartButtonProps {
  product: Product;
  discountedPrice: number | null;
}

export function AddToCartButton({ product, discountedPrice }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem({
      id: product.id,
      title: product.title,
      price: discountedPrice ?? product.price,
      image: product.images[0] ?? null,
    });
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={outOfStock}
      size="lg"
      className="w-full tracking-widest text-xs uppercase"
    >
      {outOfStock ? "Sold Out" : "Add to Cart"}
    </Button>
  );
}
