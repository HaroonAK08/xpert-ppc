import Image from 'next/image';

import type { CaseStudyContent } from '@shared/content/case-studies';

/** Shared fallback banner, used where no per-study cover applies. */
export const CASE_STUDY_BANNER = '/case-studies/case-study-banner.webp';

/**
 * Content hash per cover file. The filenames carry the hash so that replacing
 * a cover changes its URL — otherwise Next's image optimizer keeps serving the
 * previously cached rendition at the same path.
 *
 * Regenerate with: python3 scripts/hash-case-study-covers.py
 */
const COVER_HASHES: Record<string, string> = {
  'dental-physiotherapy-clinics': 'b228e098',
  'desert-farms': 'f90693ed',
  'ecommerce-growth': '618ff3a8',
  'edward-smith-seo': '2fcfffe0',
  'galadari-law-seo': 'db23022f',
  'google-ads-roas-600': 'cea6168c',
  'jj-gold-buyers': '1e89a053',
  'locks-around-the-clock': 'b03d0488',
  'locksmith-plumbing-leads': '1b6cddd8',
  'meta-ads-ardnamurchan': '2322aeec',
  'newport-beach-restaurant': '9f4ed562',
  'online-blackmail-law-firm': 'd4fca1a1',
  'peoples-firm': 'f5ad6c42',
  'rafplay': '476750b9'
};

/** Per-study cover art in public/case-studies/covers/optimized/. */
export function caseStudyCoverSrc(slug: string) {
  const hash = COVER_HASHES[slug];
  return hash
    ? `/case-studies/covers/optimized/${slug}.${hash}.webp`
    : CASE_STUDY_BANNER;
}

/**
 * Cover for a case-study card.
 *
 * Each study has its own photograph keyed to the client's actual business.
 * Nothing is overlaid here — the card body carries the metrics, so text on
 * the image would only duplicate them.
 */
export function CaseStudyCover({
  study,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
}: {
  study: CaseStudyContent;
  priority?: boolean;
  sizes?: string;
}) {
  const metric = study.metrics[0];

  return (
    <div className="relative h-full min-h-[200px] overflow-hidden bg-[#070d1c]">
      <Image
        src={caseStudyCoverSrc(study.slug)}
        alt={
          metric
            ? `${study.client} case study — ${metric.value} ${metric.label.toLowerCase()}`
            : `${study.client} case study`
        }
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
  );
}
