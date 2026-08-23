'use client';

import { usePreviewCity } from './city-preview-context';

export function AdPreviews() {
  const { city } = usePreviewCity();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-white text-zinc-900 shadow-lg">
        <p className="bg-zinc-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Google Search ad — illustration
        </p>
        <div className="p-4">
          <p className="text-[11px] text-zinc-500">Sponsored · yourclinic.com</p>
          <p className="mt-1 text-lg font-semibold text-[#1a0dab]">
            Dermatologist in {city} | Acne &amp; Laser Consults
          </p>
          <p className="mt-1 text-xs text-[#006621]">www.yourclinic.com/acne</p>
          <p className="mt-2 text-sm text-zinc-700">
            Same-week dermatology consults. From-pricing on the page. Book by WhatsApp or form.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-[#111] text-white shadow-lg">
        <p className="bg-zinc-800 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Meta / TikTok ad — illustration
        </p>
        <div className="aspect-[4/5] max-h-72 bg-gradient-to-br from-sky-200 via-rose-100 to-amber-100 p-5">
          <p className="text-xs font-semibold text-zinc-600">yourclinic</p>
          <p className="mt-16 text-2xl font-extrabold leading-tight text-zinc-900">
            Laser for pigmentation.
            <br />
            Book this week in {city}.
          </p>
          <p className="mt-3 text-sm text-zinc-700">Dermatologist-led. Honest downtime.</p>
          <span className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900">
            Book consult
          </span>
        </div>
      </div>
    </div>
  );
}
