export function RestaurantStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0E0E0E]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
      <a
        href="#audit-form"
        className="mx-auto flex h-11 max-w-xl items-center justify-center rounded-full bg-[#F5A524] px-5 text-sm font-bold text-[#0E0E0E] transition-colors hover:bg-[#ffc15a]"
      >
        Get a free restaurant audit
      </a>
    </div>
  );
}
