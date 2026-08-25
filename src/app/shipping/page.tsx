import type { Metadata } from "next";
import { Truck, Globe, ShieldCheck, RotateCcw, ClipboardList, CreditCard, UserCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "BioPlus Labs shipping, delivery, privacy, returns, ordering, payment, and account information.",
};

const SECTIONS = [
  {
    icon: Truck,
    title: "UK Delivery",
    body: [
      "BioPlus Labs dispatches from the United Kingdom on Royal Mail Tracked 24 and Tracked 48 services, with a next-working-day courier option available at checkout. Our office is open Monday to Friday, 9:00 – 18:00. Orders that are submitted, paid, and approved before our 2pm cut-off are dispatched the same working day. Orders received after the cut-off, at weekends, or on bank holidays are processed on the next working day — and any order placed after 18:00 on a Friday is processed the following Monday.",
      "Typical delivery is 1–2 working days for mainland UK. The Scottish Highlands and Islands, Northern Ireland, the Isle of Man, and the Channel Islands may take an additional working day. Delivery estimates are not guarantees and can be affected by carrier service levels, weather, and other factors outside our control.",
      "Every order is packed in plain, unbranded outer packaging with temperature-appropriate protection, and ships with the batch-matched Certificate of Analysis. Once dispatched, customers receive confirmation and tracking details by email.",
    ],
  },
  {
    icon: Globe,
    title: "International Delivery",
    body: [
      "We ship to Ireland and selected European destinations. International orders are sent on a tracked service and delivery typically takes 3–7 working days.",
      "Customers outside the UK are responsible for confirming that the products ordered may lawfully be imported into their country, and for any customs duties, import VAT, or handling charges levied on arrival. Parcels held or refused by customs are not eligible for refund of the original delivery charge.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Security",
    body: [
      "Protecting our customers' personal information is a top priority at BioPlus Labs. Our website uses industry-standard SSL (Secure Socket Layer) encryption technology to safeguard sensitive information during transmission.",
      "We maintain strict privacy practices and take reasonable measures to protect customer data from unauthorised access, disclosure, or misuse. Customer information is used solely for order processing, customer support, account management, and communications related to your purchases.",
      "BioPlus Labs does not sell, rent, or share customer information with third parties except as necessary to process payments, fulfil orders, comply with legal obligations, or provide services directly related to your purchase.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    body: [
      "Due to the nature of research compounds and laboratory materials, BioPlus Labs generally cannot accept returns once products have been dispatched, as their condition and cold-chain integrity cannot be verified after they leave us. This does not affect your statutory rights under the Consumer Contracts Regulations 2013 or the Consumer Rights Act 2015 where those rights apply.",
      "If an order arrives damaged, incomplete, or contains an incorrect item, customers should contact our support team within 48 hours of delivery. We will review the issue and, when appropriate, provide a replacement or corrective resolution.",
      "Our goal is to ensure that every customer receives exactly what was ordered and that any legitimate concerns are handled promptly and professionally.",
    ],
  },
  {
    icon: ClipboardList,
    title: "Ordering Information",
    body: [
      "Orders may be placed securely through our website twenty-four (24) hours a day, seven (7) days a week. They are reviewed and processed during office hours, Monday to Friday, 9:00 – 18:00; anything placed after 18:00 on a Friday is processed the following Monday.",
      "After an order is submitted, payment is successfully processed, and all required verification procedures are completed, the order will be prepared, packaged, and dispatched through one of our approved UK carriers.",
      "Customers will receive email notifications regarding order status, shipment confirmation, and tracking information when available.",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment, Pricing & Wholesale",
    body: [
      "BioPlus Labs accepts all major UK credit and debit cards through our secure payment platform. All prices are shown in pounds sterling (GBP) and include UK VAT where applicable. Additional payment methods may be available and will be displayed during checkout.",
      "We offer both retail and wholesale purchasing options. Quantity discounts may be available on select products and larger-volume orders. Customers interested in wholesale purchasing, laboratory supply agreements, or bulk pricing opportunities are encouraged to contact our team directly.",
    ],
  },
  {
    icon: UserCircle,
    title: "Account Access & Order History",
    body: [
      "Customers may create an account during checkout or place orders as a guest where available. Creating an account allows customers to view order history, track order status, manage account information, access previous purchases, and speed up future checkouts.",
      "Customers who choose guest checkout may contact customer support regarding order status or account-related questions.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipping & Delivery"
        title="Shipping, delivery & ordering information"
        intro="Everything you need to know about how BioPlus Labs processes, protects, and fulfils your orders."
        breadcrumb={[{ label: "Shipping & Delivery" }]}
      />
      <Container size="narrow" className="py-14">
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title} className="rounded-2xl border border-line bg-white p-7 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon size={20} />
                </span>
                <h2 className="font-display text-xl font-bold text-ink-900">{s.title}</h2>
              </div>
              <div className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink-600">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
