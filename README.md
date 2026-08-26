# BioPlus Labs — biopluslabs.co.uk

A production-grade storefront for **BioPlus Labs LTD**, built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**.

Design direction, per the client brief: premium laboratory feel in **metal-effect silver, black and orange**, matching the
product labels and the BioPlus Labs logo. Light primary canvas, deep-black premium bands, and the brand's **laboratory
orange** (`#f85000`, sampled from the supplied logo artwork) as the single accent.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

> Don't run `npm run build` while `npm run dev` is running — they share the `.next` directory.

## What's included

**Storefront**
- Home — full-bleed dark hero (animated DNA-helix + particles in brand orange, gradient headline, dispatch pill), trust bar, "BioPlus Range" band using the product render, category showcase, best-sellers, quality, affiliate band, FAQ
- Shop — full catalogue with sorting (featured, price, name)
- Product detail — mg variant selection, quantity, add-to-cart, image gallery (branded vial + range photo), and rich tabs: **Full Description** (headline, intro, purity badges, Product Details table with molecular formula / MW / CAS / form, Storage & Handling, Note), **Mixing Guide**, **Research**, **Usage**, **Reviews**
- **Peptide Dosage Calculator** (`/dosage-calculator`) — desired dose / peptide strength / volume presets + custom, live syringe visual, ml-to-draw + insulin units + doses-per-vial
- Cart (persisted to `localStorage`) + slide-in cart drawer
- Checkout — full UK address form, server-priced order summary, discount codes, and bank-transfer confirmation

**Account "Research Hub"** (`/account`) — dark dashboard, backed by real data
- Dashboard, Orders, Files & COA, Research Address, Account Settings
- Sign in and registration at `/login` and `/register`; guests can still check out

**Content & compliance**
- About, FAQ, Shipping & Delivery, Research Library, Affiliate, Wholesale, Contact
- **Certificates of Analysis** (`/certificates-of-analysis`) — searchable batch register (search by product name or batch number) above the testing-methodology sections, as specified in the client brief
- Legal: Research Disclaimer, Regulatory & Legal Notice (MHRA framing), Privacy, Terms, Returns
- **Research Access Verification** gate (18+ / RUO) on first visit
- RUO + regulatory disclaimer in the footer on every page

## Catalogue data

The catalogue lives in **Postgres** and is edited from the admin dashboard at `/admin/products` — adding a product,
changing a price or taking a SKU out of stock is live on the storefront within a second, with no deploy.

[`prisma/seed-data.ts`](prisma/seed-data.ts) holds the catalogue as originally shipped and is used only to seed a fresh
database. [`src/lib/products.ts`](src/lib/products.ts) now holds the types and pure helpers; reads go through
[`src/lib/catalog.ts`](src/lib/catalog.ts), which caches under the `products` tag so every admin write can revalidate
the storefront.

## Brand assets

Logo files are in [`public/brand/`](public/brand):

| File | Use |
| --- | --- |
| `bioplus-logo-black.png` | Client artwork, background removed — for light surfaces (header) |
| `bioplus-logo-white.png` | Silver treatment of the same artwork — for dark bands (footer, age gate) |
| `bioplus-icon-black.png` / `bioplus-icon-white.png` | Molecular ring mark only |
| `bioplus-icon-512.png` | Apple touch icon |
| `bioplus-logo-original.jpeg` | The original supplied artwork, kept for reference |

The [`Logo`](src/components/Logo.tsx) component picks the right variant per background. Brand tokens (the orange ramp,
graphite neutrals, the `.metal-plate` brushed-silver surface, fonts) are in [`src/app/globals.css`](src/app/globals.css).
Fonts: **Space Grotesk** (display/headings) + **Inter** (body).

### Media

Product visuals are photorealistic **BioPlus Labs vials** in `public/products/`
(`vial-amber/copper/charcoal/rose/pewter/clear.webp`), mapped to products by research category via
[`ProductImage`](src/components/product/ProductImage.tsx). `bioplus-range.webp` is the five-vial range shot used on the
home, Research, and product pages. Scientific reference data (molecular formula / MW / CAS / purity) lives in
[`src/lib/peptide-details.ts`](src/lib/peptide-details.ts).

`public/videos/hero-bg.mp4` is the DNA/particle loop behind the hero, colour-graded to the brand orange. It autoplays
muted and looped.

## Admin dashboard

Sign in at `/login` with a staff account and the dashboard is at **`/admin`**.

### The first admin account

There is no sign-up for staff — an admin exists only because the seed created one. The seed reads `ADMIN_EMAIL`
and `ADMIN_PASSWORD` from the environment, so on a deployed site those must be set on the hosting project
*before* the deploy that first populates the database. Sign in with exactly those two values.

The seed never overwrites an existing account: if the email is already present it logs
`admin: already exists` and moves on, and if `ADMIN_PASSWORD` is unset it logs
`admin: skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)`. Either line in a build log means no new
account was created — check there first when a sign-in is refused. Once the account exists the password lives
only as a bcrypt hash, so changing `ADMIN_PASSWORD` afterwards has no effect; a forgotten password has to be
reset against the database directly.

| Section | What it does |
| --- | --- |
| **Overview** | Revenue today and over 30 days, average order value, orders awaiting payment, low-stock alerts, 30-day chart, recent orders |
| **Orders** | Status tabs, search across number/email/surname/postcode/SKU, CSV export. Each order: mark paid → shipped → delivered, add tracking, cancel or refund (which returns stock), internal notes, printable packing slip, full event timeline |
| **Products** | One-click in-stock / out-of-stock / arriving-soon per SKU, publish or hide per product, full editor with a repeatable variant editor and image upload, duplicate as draft |
| **Inventory** | Stock per SKU, quick adjustments with a reason, low-stock filter, movement history |
| **Customers** | Order count, lifetime spend, order history, staff-only notes, suspend/reactivate, role changes |
| **Discounts** | Percentage or fixed codes with minimum spend, validity window and usage cap |
| **Settings** | Delivery rules, bank transfer details, store contact, activity log |

New orders reach an open dashboard within about three seconds, with a toast and a chime — no refresh needed.

### How orders work

Checkout re-prices every line **from the database**: the browser only supplies SKUs and quantities, so a tampered cart
cannot change what is charged. Order creation, stock decrements and discount redemption run in one transaction, and
selling the last vial takes a SKU off sale automatically. Payment is by **bank transfer** — the confirmation shows the
account details and the order number as the reference, and the owner marks the order paid once funds clear. The
`Order` model already carries `paymentMethod`/`paymentRef`, so a card processor can be added later without a migration.

## Setup

```bash
cp .env.example .env    # then fill in the values below
npm install
npm run db:deploy       # apply migrations
npm run db:seed         # seed the catalogue, settings and the first admin
npm run dev
```

| Variable | Required | What it is |
| --- | --- | --- |
| `DATABASE_URL` | yes | Pooled Postgres connection used at runtime |
| `DIRECT_DATABASE_URL` | yes | Unpooled connection for migrations (Neon's pooler cannot run DDL) |
| `AUTH_SECRET` | yes | 32+ random bytes — `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first seed | Creates the first admin account. Nothing can sign in to `/admin` until it exists |
| `BLOB_READ_WRITE_TOKEN` | no | Vercel Blob, for product images and COA uploads. Without it, uploads are disabled and products use the bundled photography |
| `RESEND_API_KEY` | no | Order confirmation and dispatch emails. Without it, emails are logged rather than sent and orders are unaffected |
| `LOGIN_RATE_LIMIT` / `REGISTER_RATE_LIMIT` | no | Per-IP throttles (default 15 sign-ins / 5 min, 20 registrations / hour). Raise for a shared institutional IP |

### Tests

```bash
npm run e2e
```

The suite signs in as `admin@biopluslabs.co.uk` with the password `devpassword123`, so seed the local database
with `ADMIN_PASSWORD=devpassword123` (or reset that account's password) before the first run.

Playwright drives a production build through the real flows: sign-in and route guards, checkout including tampered
carts and stock limits, order fulfilment, stock and price changes reaching the storefront, discounts, and a second
browser placing an order that appears on an untouched dashboard.

## Deploying to Vercel

The project is linked to this repository, so a push to the production branch deploys. Vercel runs the
`vercel-build` script rather than `build`:

```
prisma generate && prisma migrate deploy && tsx prisma/seed.ts --if-empty && next build
```

Migrations are applied on every deploy. The seed runs with `--if-empty`, so the first deploy against a blank
database populates the catalogue, store settings and the admin account, and every deploy after that leaves the
catalogue alone — otherwise a deploy would overwrite the prices and product copy edited in the dashboard.

### Environment variables

Set these on the project, for the Production environment, **before the first deploy** — the build itself reads
the database (`/product/[slug]` is prerendered from it), so a deploy without them fails at "Collecting page data".

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Pooled Neon connection (the `-pooler` host) |
| `DIRECT_DATABASE_URL` | yes | Unpooled Neon connection, for migrations |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes, first deploy | The first admin account |
| `BLOB_READ_WRITE_TOKEN` | no | Enables image and COA uploads |
| `RESEND_API_KEY` | no | Enables order emails |

Attaching a Neon store to the project from **Storage** sets `POSTGRES_URL` and `DATABASE_URL_UNPOOLED` instead of
the first two; both spellings are accepted, so there is nothing to copy across by hand.

## Still to wire up

1. **Card payments** — bank transfer is live; a processor can be added against the existing payment fields.
2. **Contact / affiliate / wholesale forms** — front-end only; connect to email or a CRM.
3. **COA batch register** — the public register in [`CoaFinder`](src/components/coa/CoaFinder.tsx) still uses
   representative entries. Per-order COA files uploaded from the dashboard already reach the customer's Research Hub.
4. **Social links** — `SITE.facebook` in [`src/lib/site.ts`](src/lib/site.ts) points at a placeholder.

## Contact (from the client brief)

BioPlus Labs LTD · 35 Drummore Drive, Prestonpans, EH32 9BZ, United Kingdom
07724 297209 (also WhatsApp) · customerservice@biopluslabs.co.uk
