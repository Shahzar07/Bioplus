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
- Shop — full catalogue with category filter + sorting (`/shop?category=metabolic` etc.)
- Product detail — mg variant selection, quantity, add-to-cart, image gallery (branded vial + range photo), and rich tabs: **Full Description** (headline, intro, purity badges, Product Details table with molecular formula / MW / CAS / form, Storage & Handling, Note), **Mixing Guide**, **Research**, **Usage**, **Reviews**
- **Peptide Dosage Calculator** (`/dosage-calculator`) — desired dose / peptide strength / volume presets + custom, live syringe visual, ml-to-draw + insulin units + doses-per-vial
- Cart (persisted to `localStorage`) + slide-in cart drawer
- Checkout — full UK address form (Town/City, County, Postcode) + order summary + confirmation (payment gateway-ready, see below)

**Account "Research Hub"** (`/account`) — dark dashboard
- Dashboard, Orders, Files & COA, Research Address, Account Settings

**Content & compliance**
- About, FAQ, Shipping & Delivery, Research Library, Affiliate, Wholesale, Contact
- **Certificates of Analysis** (`/certificates-of-analysis`) — searchable batch register (search by product name or batch number) above the testing-methodology sections, as specified in the client brief
- Legal: Research Disclaimer, Regulatory & Legal Notice (MHRA framing), Privacy, Terms, Returns
- **Research Access Verification** gate (18+ / RUO) on first visit
- RUO + regulatory disclaimer in the footer on every page

## Catalogue data

All products live in [`src/lib/products.ts`](src/lib/products.ts) — **16 product lines / 36 SKUs**, priced in **GBP** per
kit with `BPL-` catalogue numbers. Edit this one file to change products, prices, or stock.

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

## Still to wire up (intentional placeholders)

1. **Product photography** — the generated vials are placed per category. If you receive individual per-product photos,
   drop them in `public/products/` and map them in `ProductImage`.
2. **Payments** — checkout is a complete UI with an order-confirmation step. Connect the chosen gateway in
   `src/app/checkout/page.tsx` `placeOrder()` when credentials are available.
3. **Auth / orders backend** — the account area uses representative sample data. Wire to a real backend/CMS for live
   orders, COA downloads, and saved addresses.
4. **Contact / affiliate / wholesale forms** — front-end only; connect to email/CRM or a form endpoint.
5. **COA files & batch numbers** — the account "Files & COA" area and the batch register in
   [`CoaFinder`](src/components/coa/CoaFinder.tsx) use representative entries; upload the real PDFs and batch IDs when
   the testing lab supplies them.
6. **Social links** — `SITE.facebook` in [`src/lib/site.ts`](src/lib/site.ts) points at a placeholder until the client's
   page URL is confirmed.

## Contact (from the client brief)

BioPlus Labs LTD · 35 Drummore Drive, Prestonpans, EH32 9BZ, United Kingdom
07724 297209 (also WhatsApp) · customerservice@biopluslabs.co.uk
