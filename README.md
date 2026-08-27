# BioPlus Labs — biopluslabs.co.uk

A production-grade storefront for **BioPlus Labs**, built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**.

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
- Checkout — full UK address form, server-priced order summary, discount codes, and a **direct bank transfer**
  payment method that issues the account details and a payment reference automatically
- **Order payment page** (`/checkout/order-received/<order>?key=…`) — the account details, the reference and the
  order summary on a durable URL the customer can return to, reachable without an account

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
selling the last vial takes a SKU off sale automatically.

### Direct bank transfer

Payment works the way WooCommerce's BACS gateway does — the store issues the payment instructions, nobody types them
out and no proof of payment is collected:

1. **Direct bank transfer** is selected at checkout, where the account it will be paid into is previewed.
2. Placing the order records it as `AWAITING_PAYMENT` and mints an unguessable `Order.accessKey`.
3. The browser is redirected to that order's own payment page — the account details, and **the order number as the
   payment reference**, each field copyable. It is a real URL, so a refresh, a closed tab or a different device all
   reach the same page; guests get in on the key alone.
4. The confirmation email carries the same details and links back to that page, so the customer never has to ask for
   them again. Signed-in customers also see them against the order in the Research Hub.
5. A **20-minute countdown** on that page asks for the transfer to be made now. It is a prompt, not an
   expiry: nothing cancels the order or releases stock when it lapses, since a transfer can legitimately take
   longer and losing a paid order would be worse than a late one. The page keeps working afterwards.
6. The customer can attach a **screenshot of the payment** — optional, images only, 8 MB — which appears against
   the order in the dashboard. It is a convenience for matching an unclear transfer, never proof of payment:
   the funds arriving are. Uploads need `BLOB_READ_WRITE_TOKEN`; without it the box is hidden rather than
   offered and then refused.
7. The owner marks the order paid in the dashboard once the funds land, which moves it into fulfilment.

The account is edited in **Settings → Bank transfer** and nowhere else: the payment page, the email and the Research
Hub all render from [`bankTransferRows`](src/lib/payments.ts), so they cannot drift apart. Gateways are declared in
that same module, so a card processor slots in beside bank transfer against the existing `paymentMethod`/`paymentRef`
fields.

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
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first seed | Creates the first admin account |
| `BLOB_READ_WRITE_TOKEN` | no | Vercel Blob, for product images and COA uploads. Without it, uploads are disabled and products use the bundled photography |
| `RESEND_API_KEY` | no | Order confirmation and dispatch emails. Without it, emails are logged rather than sent and orders are unaffected |
| `SITE_URL` | no | Origin used for links in email, e.g. the payment page. Defaults to the Vercel deployment URL, then `https://biopluslabs.co.uk` |
| `LOGIN_RATE_LIMIT` / `REGISTER_RATE_LIMIT` | no | Per-IP throttles (default 15 sign-ins / 5 min, 20 registrations / hour). Raise for a shared institutional IP |

## Deploying

`npm run build` applies migrations before building:

```
prisma generate && prisma migrate deploy && next build
```

**This step is not optional.** The build reads the database anyway (product pages are prerendered from it), so a
deploy that skipped migrations would ship code expecting columns the database does not have — checkout would fail
with "We could not place your order" while the storefront looked fine. Vercel runs `vercel-build` when it exists,
and that is defined as `npm run build`, so both entry points apply migrations. If the project overrides the build
command in its Vercel settings, make sure the override runs `npm run build` rather than `next build` on its own.

`DIRECT_DATABASE_URL` must be set for this to work on Neon: the pooled connection cannot run DDL. On a plain
Postgres server it is the same value as `DATABASE_URL`.

If a database was created with `prisma db push` rather than migrations, `migrate deploy` stops with P3005
("the database schema is not empty"). Mark the baseline as already applied once, then deploy normally:

```bash
npx prisma migrate resolve --applied 20260825204247_init
```

### Tests

```bash
npm run e2e
```

Playwright drives a production build through the real flows: sign-in and route guards, checkout including tampered
carts and stock limits, order fulfilment, stock and price changes reaching the storefront, discounts, and a second
browser placing an order that appears on an untouched dashboard.

## Still to wire up

1. **Card payments** — direct bank transfer is live; a processor can be added as a second gateway in
   [`src/lib/payments.ts`](src/lib/payments.ts), against the existing payment fields.
2. **Contact / affiliate / wholesale forms** — front-end only; connect to email or a CRM.
3. **COA batch register** — the public register in [`CoaFinder`](src/components/coa/CoaFinder.tsx) still uses
   representative entries. Per-order COA files uploaded from the dashboard already reach the customer's Research Hub.
4. **Social links** — `SITE.facebook` in [`src/lib/site.ts`](src/lib/site.ts) points at a placeholder.

## Contact (from the client brief)

BioPlus Labs · Scotland, East Lothian, Prestonpans
07724 297209 (also WhatsApp) · customerservice@biopluslabs.co.uk
