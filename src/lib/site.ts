/* Central site configuration — company info, contact, navigation. */

export const SITE = {
  name: "BioPlus Labs",
  legalName: "BioPlus Labs",
  shortName: "BioPlus",
  domain: "biopluslabs.co.uk",
  tagline: "Research-Grade Compounds, Verified to the Batch",
  /** Support is email-only — we do not publish a telephone number. */
  email: "customerservice@biopluslabs.co.uk",
  /** Where the business is, to the town — no street address is published. */
  address: {
    town: "Prestonpans",
    county: "East Lothian",
    country: "Scotland",
  },
  addressLine: "Scotland, East Lothian, Prestonpans",
  locations: ["Prestonpans, East Lothian", "Scotland"],
  facebook: "https://www.facebook.com/",
  /**
   * Companies House registration number.
   * TODO: paste the client's number here — every place it is displayed is
   * hidden automatically while this is empty, so nothing is ever invented.
   * The business is in Scotland, so registration reads "Registered in
   * Scotland" wherever this is shown.
   */
  companyNumber: "",
  hours: {
    days: "Monday – Friday",
    time: "9:00 – 18:00",
    label: "Monday to Friday, 9:00 – 18:00",
  },
  hoursNote:
    "Our office is open Monday to Friday, 9:00 – 18:00. Orders placed after 18:00 on a Friday are processed the following Monday.",
  currency: "GBP",
  currencySymbol: "£",
};

export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "COAs", href: "/certificates-of-analysis" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Calculator", href: "/dosage-calculator" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV = {
  shop: {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Certificates of Analysis", href: "/certificates-of-analysis" },
      { label: "Research Library", href: "/research" },
      { label: "Dosage Calculator", href: "/dosage-calculator" },
      { label: "Cart", href: "/cart" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About BioPlus Labs", href: "/about" },
      { label: "Certificates of Analysis", href: "/certificates-of-analysis" },
      { label: "Dosage Calculator", href: "/dosage-calculator" },
      { label: "Research Library", href: "/research" },
      { label: "Wholesale Programme", href: "/wholesale" },
      { label: "Affiliate Programme", href: "/affiliate" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  account: {
    title: "Account",
    links: [
      { label: "Research Hub", href: "/account" },
      { label: "Orders", href: "/account/orders" },
      { label: "Certificates of Analysis", href: "/account/files" },
      { label: "Research Address", href: "/account/research-address" },
      { label: "Cart", href: "/cart" },
    ],
  },
  legal: {
    title: "Compliance & Legal",
    links: [
      { label: "Research-Use-Only Disclaimer", href: "/legal/research-disclaimer" },
      { label: "Regulatory & Legal Notice", href: "/legal/regulatory-notice" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Refunds", href: "/legal/returns" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
    ],
  },
};

export const RUO_SHORT =
  "All products are supplied strictly for laboratory and scientific research. Not for human or animal consumption.";
