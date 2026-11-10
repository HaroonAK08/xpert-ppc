import Link from 'next/link';

export default function NotFound() {
  return <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-5 text-center"><p className="text-sm font-semibold text-brand">404</p><h1 className="text-2xl font-bold text-ink">Page not found</h1><p className="text-sm text-muted">This link may be outdated or the page may have moved.</p><Link href="/" className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white">Back to home</Link></main>;
}
