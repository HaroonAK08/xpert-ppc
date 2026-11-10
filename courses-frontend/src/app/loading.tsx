export default function Loading() {
  return <div role="status" aria-live="polite" className="flex min-h-[40vh] items-center justify-center gap-3 px-5 text-sm text-muted"><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-brand" />Loading page…</div>;
}
