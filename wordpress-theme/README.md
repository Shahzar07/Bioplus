# BioPlus Labs — WordPress + WooCommerce theme

`bioplus-labs/` is the biopluslabs.co.uk storefront rebuilt as a native WordPress theme: WooCommerce for the shop, cart,
checkout, orders and account area, and Elementor widgets for every section. `bioplus-labs.zip` is the same theme, ready to
upload.

It was converted from the newest storefront code, the `claude/woocommerce-direct-bank-transfer-lmogar` branch, which is
ahead of `main`. That branch adds the bank-transfer payment page, the 20-minute payment window, the payment-screenshot upload and
the stored contact enquiries. The order email to customerservice@ from `claude/order-notification-email-nlf66y` is handled by
WooCommerce's own "New order" email. The custom `/admin` dashboard was left out on purpose; WordPress and WooCommerce admin
replace it (see the table below).

The markup keeps the original Tailwind class lists, and the stylesheet is compiled with the same Tailwind v4 and the same design
tokens (`#f85000` orange, graphite inks, brushed-silver plate). Fonts are the same Space Grotesk and Inter files, self-hosted just
as `next/font` did. Every page therefore renders with the original's spacing, type and colour.

## Installing

1. **Appearance → Themes → Add New → Upload Theme**, choose `bioplus-labs.zip`, then activate it.
2. Install and activate **WooCommerce** (required) and **Elementor** (recommended).
3. Open **Appearance → BioPlus Setup**, leave everything ticked and press **Run setup**. It:
   - creates every page with its template: Home, About, Research, Certificates of Analysis, Dosage Calculator, FAQ, Contact,
     Affiliate, Wholesale, Shipping, Sign in, Create account, and the five policies under `/legal/`;
   - imports all **18 products**, each a variable product whose variations are the vial sizes, with the original SKUs,
     prices, stock (25 for in-stock options, 0 otherwise, "Arriving soon" flags), tagline, research highlights, purity,
     formula, molecular weight, CAS number and the vial photograph;
   - configures WooCommerce: GBP, UK and Ireland only, £12 tracked delivery with free delivery over £250, direct bank transfer
     enabled, guest checkout, registration on My Account, `/account/` as the Research Hub;
   - sends every store email to **customerservice@biopluslabs.co.uk**: new, cancelled and failed order alerts and low-stock
     alerts go to it, and customer emails are sent from it;
   - adds the COA batch register, the header and footer menus, and (if Elementor is active) builds every page in Elementor
     out of the BioPlus widgets.

   Running it again updates what exists; it never duplicates pages or products, and it never resets stock.
4. Check **WooCommerce → Settings → Payments → Direct bank transfer**. The setup pre-fills the account shipped in the original
   code (Tide Business, 04-06-05 / 32437300); change it there if needed.

## Where things live in wp-admin

| Original dashboard (`/admin`) | WordPress |
| --- | --- |
| Orders, mark paid → shipped, cancel/refund | **WooCommerce → Orders**. Bank-transfer orders arrive **On hold** (shown to customers as "Awaiting payment"); set them to **Processing** once the money clears and **Completed** when shipped. |
| Payment screenshot, "I have paid" | The order screen's **BioPlus — payment, tracking & COA** box. The Orders list also has a **Payment proof** column. |
| Tracking number, per-order COA files | The same box: carrier, tracking number, and **Attach COA file** (media library). The files appear in the customer's Research Hub → Files & COA. |
| Products, stock, "arriving soon" | **Products**. Research data is on the **BioPlus research data** tab; each variation has **Strength** and **Arriving soon**. |
| Discounts | **Marketing → Coupons**. The checkout's "Discount code" field applies them. |
| Customers | **Users** / **WooCommerce → Customers** |
| Contact enquiries | **Forms** (see below) |
| Store settings, bank details | **WooCommerce → Settings**, **Appearance → Customize → BioPlus Labs** |

### Forms

Every lead is saved under **Forms** in the admin menu, with a counter of unread entries, and then emailed to the store
address with Reply-To set to the sender. That covers the contact form, affiliate applications, wholesale quote requests and
newsletter sign-ups. You can filter by form type, open an entry to read it (which marks it read), reply by email, and export to
CSV. The "Emailed to shop" column flags any entry whose notification email failed, so nothing is lost if mail breaks.

### Certificates of Analysis

The public batch register on `/certificates-of-analysis/` reads **Products → COA Batches**. Each entry has a product, batch
number, purity, test date and optional PDF link. It is seeded with the eight batches from the original.

## Editing content

- **Elementor**: the widget panel has a **BioPlus Labs** category with 26 widgets, one per section (Home Hero, Trust Bar,
  Product Grid, Process Band, Testimonials, FAQ Accordion, COA Batch Register, Dosage Calculator, Contact, and so on). Every
  text, link, icon and list item is a control. Wrap words in `[[double brackets]]` to get the orange gradient. With
  Elementor Pro, Theme Builder headers and footers replace the theme's.
- **Without Elementor**: each page template renders the original layout, and anything typed into the page editor appears
  below it. The policy pages are ordinary block-editor content.
- **Appearance → Customize → BioPlus Labs**: contact email, office hours, location, company number (hidden while empty),
  logos, announcement bar, footer text, newsletter copy, the research-access gate, the free-delivery threshold shown on the
  cart, and the payment window length and screenshot requirement.
- **Appearance → Menus**: header, the four footer columns, the footer bottom links and the policy sidebar.

## Checkout and payment

Checkout is WooCommerce's own. The theme restyles its fields into the original's three numbered panels and adds the
research-use declaration, which is required and stored on the order. Orders appear under WooCommerce → Orders, reduce stock,
and trigger WooCommerce's emails. After ordering, the customer lands on the **order-received page**, which shows:

- the bank details, each with a copy button, and the order number as the payment reference;
- a 20-minute countdown ring. It is a prompt, never an expiry, so nothing cancels the order when it runs out;
- a screenshot upload, downscaled in the browser. Files are stored privately in `uploads/bioplus-payment-proofs/` and only
  viewable with the order key or by staff;
- a **Done — I have paid** button that stops the clock, notes the order and emails the shop.

The on-hold email contains an **Open your payment page** button, so the page is reachable from any device.

## Rebuilding the stylesheet

`assets/css/theme.css` is compiled; the source is `bioplus-labs/src/tailwind.css`. After changing classes in templates:

```bash
cd wordpress-theme
npm install
npm run build      # compiles the CSS and rebuilds bioplus-labs.zip
```

Utilities are compiled `important` so Elementor's and WooCommerce's unlayered CSS can't override them.

## What was tested

Tested on WordPress 6.7 (SQLite), PHP 8.4, Chromium:

- all 105 PHP files pass `php -l`;
- PHPStan level 5 against the WordPress and WooCommerce stubs reports no real errors;
- the setup wizard's page, COA and menu steps run cleanly, and every page returns 200 with no PHP notices;
- 21 browser checks pass with no JavaScript errors: age gate, header, mobile menu, search, accordion, calculator maths and
  overdraw, COA search, and contact/newsletter submission into Forms.

WooCommerce and Elementor could not be installed in the build sandbox (wordpress.org and GitHub downloads are blocked). The
shop, cart, checkout, order and account templates were therefore checked by static analysis rather than a live checkout.
Place a test order on staging before going live.
