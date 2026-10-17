import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="bg-white pb-[40px]">
      <div className="page">
        <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(100deg,#071833_0%,#0e3f9a_45%,#1a6ef0_100%)] px-[44px] py-[36px] text-white">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 90% at 90% 40%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(ellipse 40% 70% at 10% 110%, rgba(120,190,255,0.28), transparent 50%)',
            }}
          />
          <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full border-[26px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 left-[30%] h-44 w-44 rounded-full border-[20px] border-white/10" />

          <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[30px]">
                Ready to learn your next skill?
              </h2>
              <p className="mt-[8px] text-[15px] text-white/80">
                Join thousands of learners and start your journey today.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex h-[54px] shrink-0 items-center gap-2 rounded-full bg-white px-[30px] text-[15px] font-bold text-[#1a6ef0] shadow-lg transition hover:bg-white/95"
            >
              Join Now <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
