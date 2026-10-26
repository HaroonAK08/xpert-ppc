import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Crown,
  ExternalLink,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Youtube,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { SOCIAL_LINKS } from '@/lib/socials';
import { umerKhan, upworkProfile } from '@/lib/team-content';

export const metadata: Metadata = {
  title: 'About Me | Umer Khan — XpertPPC Digital Marketing Academy',
  description: umerKhan.bio,
};

const SOCIALS = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: Linkedin, color: 'bg-[#0A66C2]' },
  { label: 'YouTube', href: SOCIAL_LINKS.youtube, icon: Youtube, color: 'bg-[#FF0000]' },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook, icon: Facebook, color: 'bg-[#1877F2]' },
  { label: 'WhatsApp', href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, color: 'bg-[#25D366]' },
];

const UPWORK = {
  name: 'Umer K.',
  avatar: '/images/team/umer-k.png',
  headline: upworkProfile.subheadline,
  badge: 'Top Rated' as const,
  rating: '4.9',
  reviews: '252',
  city: 'Lahore, Pakistan',
  jobs: '363',
  hours: '34K',
  url: SOCIAL_LINKS.upwork,
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[linear-gradient(160deg,#eaf4ff_0%,#f7fbff_42%,#ffffff_100%)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[#b9d9fe]/45 blur-3xl"
          />
          <div className="page relative py-12 sm:py-16 lg:py-20">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#1a6ef0]">About Me</p>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
              <div className="mx-auto w-full max-w-[300px]">
                <div className="relative mx-auto aspect-square w-full max-w-[260px]">
                  <div
                    aria-hidden
                    className="absolute inset-[-10%] rounded-full bg-[radial-gradient(circle,#b0d5fc_0%,rgba(176,213,252,0)_70%)]"
                  />
                  <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-white shadow-[0_20px_50px_-20px_rgba(26,110,240,0.45)]">
                    <Image
                      src="/images/team/umer-khan.png"
                      alt={`${umerKhan.name}, ${umerKhan.role}`}
                      fill
                      sizes="260px"
                      className="object-cover object-top"
                      priority
                      unoptimized
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {SOCIALS.map(({ label, href, icon: Icon, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105 ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h1 className="text-[2.25rem] font-extrabold leading-[1.1] tracking-tight text-[#0a1b3f] sm:text-[2.75rem]">
                  {umerKhan.name}
                </h1>
                <p className="mt-2 text-[17px] font-semibold text-[#1a6ef0]">{umerKhan.role}</p>
                <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#5b6d89] sm:text-[17px]">
                  {umerKhan.bio}
                </p>

                <div className="mt-6 flex flex-col gap-2.5 text-sm text-[#5b6d89] sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="inline-flex items-center gap-2 font-medium transition hover:text-[#1a6ef0]"
                  >
                    <Mail className="h-4 w-4 text-[#1a6ef0]" />
                    {SOCIAL_LINKS.email}
                  </a>
                  <a
                    href={`tel:${SOCIAL_LINKS.phoneRaw}`}
                    className="inline-flex items-center gap-2 font-medium transition hover:text-[#1a6ef0]"
                  >
                    <Phone className="h-4 w-4 text-[#1a6ef0]" />
                    {SOCIAL_LINKS.phoneDisplay}
                  </a>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium transition hover:text-[#1a6ef0]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    {SOCIAL_LINKS.whatsappDisplay}
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={SOCIAL_LINKS.upwork}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary h-11 px-5"
                  >
                    Hire on Upwork <ExternalLink className="h-4 w-4" />
                  </a>
                  <Link
                    href="/signup"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#d7e6ff] bg-white px-6 text-[15px] font-bold text-[#0a1b3f] transition hover:border-[#1a6ef0] hover:text-[#1a6ef0]"
                  >
                    Join the Academy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#edf2f9] bg-white py-12 sm:py-16">
          <div className="page grid gap-6 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#e3ebf7] bg-[#f8fbff] p-6 sm:p-7">
              <h2 className="text-xl font-extrabold tracking-tight text-[#0a1b3f]">Core Expertise</h2>
              <ul className="mt-5 space-y-3.5">
                {umerKhan.expertise.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#5b6d89]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1a6ef0]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] border border-[#e3ebf7] bg-[#f8fbff] p-6 sm:p-7">
              <h2 className="text-xl font-extrabold tracking-tight text-[#0a1b3f]">Key Achievements</h2>
              <ul className="mt-5 space-y-3.5">
                {umerKhan.achievements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#5b6d89]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-[#edf2f9] bg-[#f5f8fc] py-12 sm:py-16">
          <div className="page">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#14a800]">Upwork</p>
              <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#0a1b3f] sm:text-[32px]">
                Work with {umerKhan.name}
              </h2>
              <p className="mt-2 text-[15px] text-[#5b6d89]">{upworkProfile.intro}</p>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
              {upworkProfile.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[14px] border border-[#e3ebf7] bg-white px-5 py-4 text-center shadow-[0_8px_24px_-16px_rgba(10,27,63,0.2)]"
                >
                  <p className="text-[15px] font-extrabold text-[#0a1b3f]">{item.title}</p>
                  <p className="mt-1 text-[13px] text-[#5b6d89]">{item.description}</p>
                </div>
              ))}
            </div>

            <article className="mx-auto mt-8 max-w-[380px] rounded-[16px] border border-[#e8ecf1] bg-white px-6 pb-6 pt-7 text-center shadow-[0_14px_36px_-18px_rgba(10,27,63,0.28)]">
              <div className="relative mx-auto h-[104px] w-[104px]">
                <Image
                  src={UPWORK.avatar}
                  alt={UPWORK.name}
                  width={104}
                  height={104}
                  unoptimized
                  className="h-[104px] w-[104px] rounded-full object-cover"
                />
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[18px] font-bold tracking-tight text-[#001e00]">
                {UPWORK.name}
                <BadgeCheck className="h-[18px] w-[18px] shrink-0 fill-[#1f57c3] text-white" />
              </p>
              <p className="mt-1.5 px-1 text-[13px] leading-[1.35] text-[#5e6d55]">{UPWORK.headline}</p>

              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12.5px] font-semibold text-[#001e00]">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1f57c3]">
                    <Crown className="h-[11px] w-[11px] text-white" strokeWidth={2.5} />
                  </span>
                  100%
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-[#1f57c3]" />
                  {UPWORK.badge}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-[15px] w-[15px] fill-[#f5b800] text-[#f5b800]" />
                  {UPWORK.rating} ({UPWORK.reviews})
                </span>
              </div>

              <p className="mt-2.5 flex items-center justify-center gap-1 text-[12px] text-[#5e6d55]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {UPWORK.city}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[10px] bg-[#f2f2f2] px-3 py-2.5">
                  <p className="text-[18px] font-bold leading-none text-[#001e00]">{UPWORK.jobs}</p>
                  <p className="mt-1 text-[11.5px] text-[#5e6d55]">Total jobs</p>
                </div>
                <div className="rounded-[10px] bg-[#f2f2f2] px-3 py-2.5">
                  <p className="text-[18px] font-bold leading-none text-[#001e00]">{UPWORK.hours}</p>
                  <p className="mt-1 text-[11.5px] text-[#5e6d55]">Total hours</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {upworkProfile.stats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="rounded-[10px] bg-[#f7faf7] px-2 py-2">
                    <p className="text-[13px] font-bold leading-none text-[#14a800]">{stat.value}</p>
                    <p className="mt-1 text-[10px] leading-tight text-[#5e6d55]">{stat.label}</p>
                  </div>
                ))}
              </div>

              <a
                href={UPWORK.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-[44px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#14a800] text-[14px] font-bold text-white transition hover:bg-[#128f00]"
              >
                View on Upwork
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
