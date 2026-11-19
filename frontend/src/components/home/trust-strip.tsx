import { Award, BadgeCheck, Star } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { services } from '@shared/content/services';

const credentials = [
  { Icon: Award, label: 'Google Partner expertise' },
  { Icon: Star, label: 'Top-Rated Plus on Upwork' },
  { Icon: BadgeCheck, label: 'Meta Ads specialists' },
];

/**
 * Thin band directly under the hero: the six platforms we buy on, plus the
 * credentials that used to be buried in a single line of hero copy.
 */
export function TrustStrip() {
  return (
    <section
      aria-label="Platforms and credentials"
      className="border-y border-white/[0.07] bg-[#060c1d] py-8 md:py-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={12} amount={0.2}>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#6d7f9e]">
            Certified and buying daily across
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.06}
          amount={0.2}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {services.map((s) => (
            <RevealItem key={s.slug} y={10}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-2 text-[13px] font-semibold text-[#c6d2e6] sm:px-4">
                <Icon name={s.icon} className="h-4 w-4 shrink-0 text-primary" />
                {s.name}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal y={10} amount={0.2} className="mt-7">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/[0.07] pt-6">
            {credentials.map(({ Icon: Glyph, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#8e9fbc]"
              >
                <Glyph className="h-4 w-4 shrink-0 text-primary/80" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
