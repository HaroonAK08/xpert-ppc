'use client';

import Link from 'next/link';

export default function CourseVerifyError() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h1 className="mb-2 text-xl font-extrabold">Something went wrong</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Go back to apply or sign in. If you already applied, wait for an email if you’re accepted.
      </p>
      <Link href="/courses/signup" className="font-semibold text-primary hover:underline">
        Apply again
      </Link>
    </div>
  );
}
