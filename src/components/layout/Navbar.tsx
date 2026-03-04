"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Category } from "@/lib/db/schema";

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  // Guard against hydration mismatch — only show count after mount
  const [mounted, setMounted] = useState(false);

  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.count);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = mounted ? count() : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xs tracking-[0.25em] uppercase font-medium"
        >
          introvertwears
        </Link>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Cart button */}
        <button
          onClick={openCart}
          className="relative p-1 text-foreground hover:opacity-60 transition-opacity"
          aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-foreground text-background text-[9px] font-medium rounded-full">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
