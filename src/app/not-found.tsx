import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="band-dark relative overflow-hidden text-white">
      <div className="hairline-grid absolute inset-0 opacity-60" />
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="brand-text-gradient font-display text-7xl font-extrabold sm:text-8xl">404</span>
        <h1 className="font-display mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 max-w-md text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to the lab.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="light">
            Back to home
          </ButtonLink>
          <ButtonLink href="/shop" variant="outlineDark">
            Browse the catalogue
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
