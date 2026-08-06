'use client';

import Link from 'next/link';

export default function VerifyError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-md px-4 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Verification page failed to load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your OTP email was still sent. Refresh this page or open the link again and enter the
          code.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            Try again
          </button>
          <Link
            href="/courses/signup"
            className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-semibold"
          >
            Back to signup
          </Link>
        </div>
      </div>
    </section>
  );
}
