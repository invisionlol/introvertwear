# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev            # Start dev server (localhost:3000)
bun build          # Production build
bun lint           # ESLint

bun db:generate    # Generate Drizzle migration files from schema changes
bun db:migrate     # Apply pending migrations to Supabase
bun db:push        # Push schema directly (no migration files — dev only)
bun db:studio      # Open Drizzle Studio (visual DB browser)
```

Always use `bun` (not `npm` or `yarn`). Runtime is Bun 1.x.

## Architecture

### Tech Stack
- **Next.js 16** (App Router, `src/` directory, no Turbopack)
- **Bun** as runtime and package manager
- **Supabase** (PostgreSQL) + **Drizzle ORM** for database
- **Stripe Checkout** for payments
- **Tailwind CSS v4** + **Shadcn UI** for styling
- **Framer Motion** for animations
- **Zustand** for cart state

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, providers
│   ├── page.tsx                # Home page (hero, new arrivals, campaigns)
│   ├── category/[slug]/        # Category product listing
│   ├── product/[id]/           # Product detail page
│   ├── admin/                  # Protected CMS (product/category/campaign CRUD)
│   │   ├── products/
│   │   ├── categories/
│   │   └── campaigns/
│   └── api/
│       ├── checkout/           # POST → create Stripe Checkout session
│       └── webhooks/stripe/    # Stripe webhook → update orders table
├── components/
│   ├── ui/                     # Shadcn UI primitives (auto-generated, don't edit)
│   ├── layout/                 # Navbar, Footer, CartDrawer
│   ├── shop/                   # ProductCard, ProductGrid, HeroSection
│   ├── cart/                   # Cart drawer, cart item, cart context
│   └── admin/                  # Admin table, forms, modals
├── lib/
│   ├── db/                     # Drizzle client + schema definitions
│   │   ├── schema.ts           # All table schemas
│   │   └── index.ts            # Drizzle client (uses DATABASE_URL)
│   ├── stripe/                 # Stripe client singleton
│   └── supabase/               # Supabase browser + server clients
├── store/
│   └── cart.ts                 # Zustand cart store
├── hooks/                      # Custom React hooks
└── types/                      # Shared TypeScript types
drizzle/
└── migrations/                 # Auto-generated SQL migrations
```

### Database Schema (Drizzle + Supabase)
- `categories` — id, name, slug
- `products` — id, title, description, price, stock, category_id, images (text[]), created_at
- `campaigns` — id, name, discount_percentage, is_active, valid_until
- `orders` — id, customer_email, total_amount, stripe_session_id, status

### Design System
- **Aesthetic:** Monochromatic (black/white/grey), editorial, minimal, moody
- **Radius:** `0rem` (sharp edges — do NOT add rounded corners unless intentional)
- **Typography:** Geist Sans, tight tracking (`letter-spacing: -0.03em` on headings)
- **Animations:** Framer Motion only — keep them subtle (fade/slide, no bounce)
- Colors are defined as CSS custom properties in `globals.css` using `oklch`. Never hardcode hex colors; use Tailwind semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.)

### Admin Protection
Admin routes at `/admin` are protected via `ADMIN_SECRET` env var. Middleware checks for a session cookie set when the admin enters the correct secret.

### Stripe Flow
1. Client POSTs cart items to `/api/checkout`
2. Server creates a Stripe Checkout Session and returns the URL
3. Client redirects to Stripe
4. On success, Stripe fires webhook to `/api/webhooks/stripe`
5. Webhook verifies signature with `STRIPE_WEBHOOK_SECRET` and upserts order status

## Environment Variables
Copy `.env.example` to `.env.local` and fill in values. See `.env.local` comments for where to find each value.
