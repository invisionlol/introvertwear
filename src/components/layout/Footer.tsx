export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase font-medium">
            introvertwears
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Minimal. Intentional. Yours.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            { label: "Instagram", href: "https://www.instagram.com/introvertwears/" },
            { label: "Shipping", href: "#" },
            { label: "Returns", href: "#" },
            { label: "Contact", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} introvertwears
        </p>
      </div>
    </footer>
  );
}
