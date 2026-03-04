"use client";

import { useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";

type Step = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, total, count } =
    useCartStore();

  const [step, setStep] = useState<Step>("cart");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeCart();
      // Reset back to cart step after drawer closes (slight delay so animation finishes)
      setTimeout(() => {
        if (step === "success") setStep("cart");
      }, 300);
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !items.length) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Order failed. Please try again.");
        return;
      }

      const data = await res.json();
      setOrderId(data.orderId);
      setStep("success");
      clearCart();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[420px] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-medium tracking-tight">
              {step === "checkout" ? "Checkout" : `Cart${count() > 0 ? ` (${count()})` : ""}`}
            </SheetTitle>
            <button
              onClick={() => closeCart()}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </SheetHeader>

        {/* ── Success State ─────────────────────────────────────── */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-5 text-center">
            <div className="w-14 h-14 border border-border flex items-center justify-center">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <p className="font-medium tracking-tight">Order received.</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                We&apos;ll reach out to <span className="text-foreground">{email}</span> to
                arrange payment and delivery.
              </p>
              {orderId && (
                <p className="text-xs text-muted-foreground">Order #{orderId}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setStep("cart");
                setEmail("");
                setOrderId(null);
                closeCart();
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}

        {/* ── Empty State ───────────────────────────────────────── */}
        {step !== "success" && items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-3 text-center">
            <ShoppingBag size={28} strokeWidth={1} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          </div>
        )}

        {/* ── Cart Items + Footer ───────────────────────────────── */}
        {step !== "success" && items.length > 0 && (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-[60px] shrink-0 aspect-[3/4] bg-muted overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-snug tracking-tight truncate pr-1">
                        {item.title}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center gap-3 border border-border px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs w-3 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-sm tabular-nums">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border px-6 py-5 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
                  Total
                </span>
                <span className="font-medium tabular-nums">
                  ฿{total().toLocaleString()}
                </span>
              </div>

              {/* Cart step CTA */}
              {step === "cart" && (
                <Button
                  className="w-full tracking-widest text-xs uppercase"
                  onClick={() => setStep("checkout")}
                >
                  Checkout
                </Button>
              )}

              {/* Checkout step — email form */}
              {step === "checkout" && (
                <form onSubmit={handlePlaceOrder} className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">
                      Enter your email and we&apos;ll contact you to arrange payment and delivery.
                    </p>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setStep("cart")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="flex-1 tracking-widest text-xs uppercase"
                      disabled={loading}
                    >
                      {loading ? "Placing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
