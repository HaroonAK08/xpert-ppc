import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="page flex min-h-[70vh] flex-col items-start justify-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">404</p>
      <h1 className="page-title mt-3">That page is not in the CRM.</h1>
      <p className="mt-2 max-w-md text-sm text-muted">The link may be old, or the page was never added.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
