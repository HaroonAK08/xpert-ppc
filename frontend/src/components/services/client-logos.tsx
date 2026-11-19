import Image from 'next/image';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { caseStudyClientAssets } from '@/lib/case-study-client-assets';
import { getCaseStudy } from '@shared/content/case-studies';
import { cn } from '@/lib/utils';

/**
 * Brand wall built from the client assets already held for the case studies.
 *
 * Most of these marks are dark artwork on transparency, drawn for light
 * surfaces, so they sit on a white tile — inverting them would wreck the
 * multi-colour ones. The exceptions are listed below: artwork that is white
 * on transparency, which needs the opposite treatment or it disappears.
 */
const LIGHT_ARTWORK = new Set(['galadari-law-seo']);

const brands = Object.entries(caseStudyClientAssets)
  .filter(([, a]) => Boolean(a.logoSrc))
  .map(([slug, a]) => ({
    slug,
    name: getCaseStudy(slug)?.client ?? a.logoAlt ?? '',
    logo: a.logoSrc as string,
    alt: a.logoAlt ?? '',
    onDark: LIGHT_ARTWORK.has(slug),
  }));

export function ClientLogos({ channel }: { channel: string }) {
  return (
    <section
      aria-label="Clients"
      className="border-y border-white/[0.07] bg-[#060c1d] py-14 md:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={12} amount={0.2}>
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#6d7f9e]">
            Brands we&apos;ve worked with
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#8e9fbc]">
            Every logo below has a published case study behind it. Ask for the {channel} detail on
            any of them during the audit.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.06}
          amount={0.15}
          className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {brands.map((b) => (
            <RevealItem key={b.slug} y={10}>
              <figure
                className={cn(
                  'flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border px-5 transition-transform duration-300 hover:-translate-y-0.5',
                  b.onDark
                    ? 'border-white/[0.12] bg-white/[0.06]'
                    : 'border-white/[0.09] bg-white'
                )}
              >
                <Image
                  src={b.logo}
                  alt={b.alt}
                  width={220}
                  height={64}
                  className="h-11 w-auto max-w-full object-contain"
                />
                <figcaption className="sr-only">{b.name}</figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
