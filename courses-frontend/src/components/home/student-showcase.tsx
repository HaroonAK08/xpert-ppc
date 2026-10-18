import Image from 'next/image';
import { ArrowUpRight, BadgeCheck, Building2, Crown, MapPin, Sparkles, Star } from 'lucide-react';

type Profile = {
  name: string;
  avatar: string;
  headline: string;
  badge: 'Top Rated Plus' | 'Top Rated' | 'Agency';
  rating?: string;
  reviews?: string;
  city: string;
  jobs: string;
  hours: string;
  url: string;
  ring?: boolean;
  kind?: 'agency' | 'freelancer';
  earned?: string;
};

const PROFILES: Profile[] = [
  {
    name: 'Xpert PPC',
    avatar: '/images/team/xpert-ppc-agency.png',
    headline: 'Xpert PPC | Google Ads, Meta Ads, SEO & PPC Growth Agency',
    badge: 'Agency',
    city: 'Lahore, Pakistan',
    jobs: '43',
    hours: '7.4K',
    earned: '$30K+',
    url: 'https://www.upwork.com/agencies/425244618658050048/',
    kind: 'agency',
  },
  {
    name: 'Waseem Niazi',
    avatar: '/images/team/waseem.png',
    headline: 'Google Ads - Microsoft-Bing - Meta/Facebook Ads - GA4 & GTM Expert.',
    badge: 'Top Rated Plus',
    rating: '4.9',
    reviews: '157',
    city: 'Bahawalpur, Pakistan',
    jobs: '229',
    hours: '25K',
    url: 'https://www.upwork.com/freelancers/~01f8fe5f1ed7fe4143',
  },
  {
    name: 'Hamayoun k.',
    avatar: '/images/team/hamayoun.png',
    headline: 'Google Ads & Meta Ads Expert | Local Service & E-Commerce Business',
    badge: 'Top Rated Plus',
    rating: '5.0',
    reviews: '85',
    city: 'Lahore, Pakistan',
    jobs: '157',
    hours: '13K',
    url: 'https://www.upwork.com/freelancers/~01104d06acd4460a03',
  },
  {
    name: 'Ahsan A.',
    avatar: '/images/team/ahsan.png',
    headline: 'Senior Google Ads Growth Strategist // 100M+ Ad Spend Managed',
    badge: 'Top Rated Plus',
    rating: '5.0',
    reviews: '127',
    city: 'Multan, Pakistan',
    jobs: '174',
    hours: '19K',
    url: 'https://www.upwork.com/freelancers/ahsanazkar',
    ring: true,
  },
  {
    name: 'Sidra N.',
    avatar: '/images/team/sidra.png',
    headline: 'Performance Marketer | SEO, Google Ads, Facebook Ads | 10+ Years',
    badge: 'Top Rated',
    rating: '4.7',
    reviews: '110',
    city: 'Lahore, Pakistan',
    jobs: '155',
    hours: '12K',
    url: 'https://www.upwork.com/freelancers/~01787e1d5f2f5d708d',
  },
  {
    name: 'Mamoon K.',
    avatar: '/images/team/mamoon.png',
    headline: 'Certified PPC Expert | Google Ads, Meta & Bing | ROI-Focused',
    badge: 'Top Rated',
    rating: '3.9',
    reviews: '27',
    city: 'Sahiwal, Pakistan',
    jobs: '46',
    hours: '4.4K',
    url: 'https://www.upwork.com/freelancers/drmak',
  },
];

function ProfileCard({ profile }: { profile: Profile }) {
  const agency = profile.kind === 'agency';
  const plus = profile.badge === 'Top Rated Plus';

  return (
    <article className="flex h-full flex-col rounded-[14px] border border-[#e8ecf1] bg-white px-5 pb-5 pt-6 text-center shadow-[0_8px_24px_-14px_rgba(10,27,63,0.22)]">
      <div className="relative mx-auto h-[92px] w-[92px]">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={92}
          height={92}
          unoptimized
          className="h-[92px] w-[92px] rounded-full object-cover"
        />
        {!agency ? (
          <span
            className={
              profile.ring
                ? 'absolute left-[2px] top-0 h-[13px] w-[13px] rounded-full border-[2.5px] border-white bg-[#9aa3af]'
                : 'absolute left-[4px] top-[2px] h-[13px] w-[13px] rounded-full border-[2.5px] border-white bg-[#9aa3af]'
            }
          />
        ) : null}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[17px] font-bold tracking-tight text-[#001e00]">
        {profile.name}
        <BadgeCheck className="h-[18px] w-[18px] shrink-0 fill-[#1f57c3] text-white" />
      </p>

      <p className="mt-1.5 min-h-[40px] px-1 text-[13px] leading-[1.35] text-[#5e6d55]">{profile.headline}</p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12.5px] font-semibold text-[#001e00]">
        <span className="inline-flex items-center gap-1">
          <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1f57c3]">
            <Crown className="h-[11px] w-[11px] text-white" strokeWidth={2.5} />
          </span>
          100%
        </span>
        <span className="inline-flex items-center gap-1">
          {agency ? (
            <>
              <Building2 className="h-4 w-4 text-[#14a800]" />
              Agency
            </>
          ) : (
            <>
              <Sparkles className={plus ? 'h-4 w-4 text-[#e85fb0]' : 'h-4 w-4 text-[#1f57c3]'} />
              {profile.badge}
            </>
          )}
        </span>
        {profile.rating && profile.reviews ? (
          <span className="inline-flex items-center gap-1">
            <Star className="h-[15px] w-[15px] fill-[#f5b800] text-[#f5b800]" />
            {profile.rating} ({profile.reviews})
          </span>
        ) : agency && profile.earned ? (
          <span className="inline-flex items-center gap-1 text-[#14a800]">{profile.earned} earned</span>
        ) : null}
      </div>

      <p className="mt-2.5 flex items-center justify-center gap-1 text-[12px] text-[#5e6d55]">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {profile.city}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[10px] bg-[#f2f2f2] px-3 py-2">
          <p className="text-[17px] font-bold leading-none text-[#001e00]">{profile.jobs}</p>
          <p className="mt-1 text-[11.5px] text-[#5e6d55]">Total jobs</p>
        </div>
        <div className="rounded-[10px] bg-[#f2f2f2] px-3 py-2">
          <p className="text-[17px] font-bold leading-none text-[#001e00]">{profile.hours}</p>
          <p className="mt-1 text-[11.5px] text-[#5e6d55]">Total hours</p>
        </div>
      </div>

      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#14a800]/35 bg-white text-[13.5px] font-semibold text-[#14a800] transition hover:border-[#14a800] hover:bg-[#f3faf3]"
      >
        {agency ? 'View Agency on Upwork' : 'View on Upwork'}
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </a>
    </article>
  );
}

export function StudentShowcase() {
  return (
    <section id="my-team" className="scroll-mt-20 bg-[#f5f8fc] py-[56px]">
      <div className="page">
        <div className="text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#1a6ef0]">Our experts</p>
          <h2 className="mt-[10px] text-[30px] font-extrabold leading-[1.2] tracking-tight text-[#0a1b3f] sm:text-[34px]">
            My Team
          </h2>
          <p className="mt-[10px] text-[15px] text-[#5b6d89]">
            Xpert PPC agency and verified Upwork specialists who teach and deliver.
          </p>
        </div>

        <div className="mt-[36px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {PROFILES.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
