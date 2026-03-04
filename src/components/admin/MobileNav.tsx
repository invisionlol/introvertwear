"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Package, Tag, Megaphone, ExternalLink, LogOut } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const nav = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — hidden on md+ */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-sidebar-border bg-sidebar shrink-0">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-sidebar-foreground/40 uppercase leading-none mb-0.5">
            introvertwears
          </p>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors p-1"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-56 p-0 gap-0 bg-sidebar border-r border-sidebar-border flex flex-col"
        >
          <div className="px-6 py-7 border-b border-sidebar-border shrink-0">
            <p className="text-[10px] tracking-[0.3em] text-sidebar-foreground/40 uppercase mb-0.5">
              introvertwears
            </p>
            <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
          </div>

          <nav className="flex-1 py-4 space-y-0.5 px-3">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5 shrink-0">
            <Link
              href="/"
              target="_blank"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
            >
              <ExternalLink size={15} strokeWidth={1.5} />
              View Store
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
              >
                <LogOut size={15} strokeWidth={1.5} />
                Logout
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
