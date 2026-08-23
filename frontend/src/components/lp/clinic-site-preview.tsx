'use client';

import { usePreviewCity } from './city-preview-context';

export function ClinicWebsitePreview() {
  const { city } = usePreviewCity();
  const pages = [
    { name: 'Acne treatment', city },
    { name: 'Laser pigmentation', city },
    { name: 'Cosmetic consult', city },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="border-b border-primary/15 px-5 py-4 sm:px-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
          How your clinic looks
        </p>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          A site built to book consults
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Treatment pages, from-pricing, and a booking path — not a brochure that dumps people on
          a contact form.
        </p>
      </div>

      <div className="bg-zinc-100 p-3 sm:p-4">
        <div className="overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
              yourclinic.com/acne-treatment
            </div>
          </div>
          <div className="grid gap-0 sm:grid-cols-[1fr_0.9fr]">
            <div className="p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a73e8]">
                Dermatology clinic
              </p>
              <p className="mt-1 text-lg font-extrabold leading-snug">
                Acne treatment in {city} — book a consult this week
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Dermatologist-led plans for active acne and scarring. From-pricing on the page.
                Same-week appointments.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-[#1a73e8] px-3 py-1.5 text-[11px] font-bold text-white">
                  Book consultation
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-600">
                  WhatsApp
                </span>
              </div>
            </div>
            <div className="border-t border-zinc-200 bg-zinc-50 p-4 sm:border-l sm:border-t-0">
              <p className="mb-2 text-[10px] font-bold uppercase text-zinc-400">Also ranking</p>
              <ul className="space-y-2">
                {pages.map((p) => (
                  <li
                    key={p.name}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-zinc-800">{p.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      {p.name.toLowerCase()} {p.city}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Illustration of a conversion-focused clinic site we build or rebuild for ads and SEO.
        </p>
      </div>
    </div>
  );
}
