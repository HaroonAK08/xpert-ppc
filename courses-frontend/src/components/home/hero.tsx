import Image from 'next/image';
import Link from 'next/link';
import { Radio, ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero relative overflow-hidden">
      <div className="page relative grid items-center gap-10 pb-[56px] pt-[48px] lg:grid-cols-[1fr_0.95fr]">
        <div className="relative z-10 max-w-[620px]">
          <span className="inline-flex h-[38px] items-center gap-2 rounded-full border border-[#c9dfff] bg-white px-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1a6ef0] shadow-[0_2px_10px_rgba(26,110,240,0.08)]">
            <Radio className="h-4 w-4" strokeWidth={2.5} />
            Live online classes
          </span>

          <h1 className="mt-[18px] text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0a1b3f] sm:whitespace-nowrap sm:text-[38px] lg:text-[42px]">
            Learn Digital Marketing.
            <br />
            <span className="text-[#1a6ef0]">Start Building Your Future.</span>
          </h1>

          <p className="mt-[16px] max-w-[420px] text-[17px] leading-[1.55] text-[#5b6d89]">
            Live classes in advertising, SEO and winning clients.
          </p>

          <div className="mt-[26px] flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/courses"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[13px] bg-[#1a6ef0] px-8 text-[15px] font-bold text-white shadow-[0_12px_26px_-8px_rgba(26,110,240,0.55)] transition hover:bg-[#155fd9]"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <a
              href="#learning-journey"
              className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[13px] border-[1.5px] border-[#b9d2f7] bg-white px-6 text-[15px] font-bold text-[#1a6ef0] transition hover:border-[#1a6ef0] hover:bg-[#e8f1ff]"
            >
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#1a6ef0] text-white">
                <Play className="h-3 w-3 fill-current" />
              </span>
              How It Works
            </a>
          </div>
        </div>

        <div className="hero-img-wrap relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <Image
            src="/images/home-hero-exact.jpg"
            alt="Laptop showing Digital Marketing Academy dashboard with Ads, SEO, Video, Social and Community icons"
            width={1280}
            height={720}
            priority
            className="hero-img h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
