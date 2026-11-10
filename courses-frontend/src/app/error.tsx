'use client';

import Link from 'next/link';

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-5 text-center"><h2 className="text-xl font-bold text-ink">This page could not be loaded</h2><p role="alert" className="text-sm text-muted">Please try again. If the problem continues, return to the home page.</p><button type="button" onClick={reset} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white">Try again</button><Link href="/" className="text-sm font-semibold text-brand">Go to home page</Link></main>;
}
