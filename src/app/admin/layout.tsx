import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Package, Tag, Megaphone, ExternalLink, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

async function AdminSidebar() {
  const nav = [
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  ];

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-sidebar-border">
        <p className="text-[10px] tracking-[0.3em] text-sidebar-foreground/40 uppercase mb-0.5">
          introvertwears
        </p>
        <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          View Store
        </Link>
        <form action="/api/admin/auth" method="POST">
          <button
            formAction={async () => {
              "use server";
              const cookieStore = await cookies();
              cookieStore.delete("admin_token");
              redirect("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-card overflow-auto">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
