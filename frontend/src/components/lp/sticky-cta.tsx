'use client';

export function StickyLpCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-background/95 p-3 backdrop-blur-md lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <a
        href="#audit-form"
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
      >
        See the 3 searches — free audit
      </a>
    </div>
  );
}
