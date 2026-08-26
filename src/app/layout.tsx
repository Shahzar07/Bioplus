import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { AgeGate } from "@/components/AgeGate";
import { SITE } from "@/lib/site";
import { CatalogProvider } from "@/lib/catalog-context";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCatalogue } from "@/lib/catalog";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-src",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${SITE.domain}`),
  title: {
    default: `${SITE.name} — High-Purity Research Compounds`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "BioPlus Labs supplies UK researchers with high-purity research peptides and laboratory materials, batch-tested by HPLC/UPLC/MS and shipped with a matching Certificate of Analysis. Research Use Only.",
  icons: {
    icon: "/brand/bioplus-icon-black.png",
    apple: "/brand/bioplus-icon-512.png",
  },
  openGraph: {
    title: `${SITE.name} — High-Purity Research Compounds`,
    description:
      "UK-supplied research peptides and laboratory materials, batch-tested for identity and purity. Research Use Only.",
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalogue = await getCatalogue();

  return (
    <html lang="en-GB" className={`${display.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        <CatalogProvider catalogue={catalogue}>
          <CartProvider>
            <SiteChrome
              header={
                <>
                  <AgeGate />
                  <AnnouncementBar />
                  <Header />
                </>
              }
              footer={
                <>
                  <Footer />
                  <CartDrawer />
                </>
              }
            >
              {children}
            </SiteChrome>
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
