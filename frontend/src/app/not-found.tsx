import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-background py-20">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-6xl font-extrabold text-primary">404</p>
        <h1 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          The link may be broken or the page may have moved. Here are some useful places to go
          instead.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-hover-effect inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Browse Services
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Get a Free Audit
          </Link>
        </div>
      </div>
    </section>
  );
}
