export function AutoRepairStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0E1114]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-24 pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.3)] backdrop-blur lg:hidden">
      <a
        href="#audit-form"
        className="mx-auto flex h-11 max-w-xl items-center justify-center rounded-full bg-[#E2793A] px-5 text-sm font-bold text-[#0E1114] transition-colors hover:bg-[#ec8f58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2793A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1114]"
      >
        Get a free shop audit
      </a>
    </div>
  );
}
