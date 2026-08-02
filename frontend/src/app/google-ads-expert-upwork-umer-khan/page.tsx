import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, Quote, Star } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { umerKhan, upworkProfile as u } from '@shared/content/team';
import { buildMetadata, personSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: u.seo.title,
  description: u.seo.description,
  path: '/google-ads-expert-upwork-umer-khan',
  keywords: u.seo.keywords,
  type: 'profile',
});

export default function UpworkPage() {
  return (
    <>
      <JsonLd
        data={personSchema({
          name: umerKhan.name,
          role: 'Google Ads Expert / PPC Specialist',
          description: u.about,
          path: '/google-ads-expert-upwork-umer-khan',
          image: umerKhan.photo,
          sameAs: [siteConfig.socials.upwork, siteConfig.socials.linkedin],
        })}
      />

      <section className="relative overflow-hidden bg-background pb-16 pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <LoadFade y={20} duration={0.5} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Upwork Profile' }]} />

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
            <Star className="h-4 w-4 fill-current" /> Top Rated
          </div>

          <h1 className="mb-3 max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            {u.headline}
          </h1>
          <p className="mb-5 text-lg font-semibold text-primary">{u.subheadline}</p>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {u.intro}
          </p>

          <a
            href={siteConfig.socials.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover-effect inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#14a800] px-6 text-sm font-bold text-white shadow-[0_0_15px_rgba(20,168,0,0.4)] transition-all hover:bg-[#14a800]/90"
          >
            Hire Me on Upwork <ExternalLink className="h-4 w-4" />
          </a>
        </LoadFade>
      </section>

      <section className="border-y border-border bg-card/40 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealGroup as="dl" stagger={0.07} className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
            {u.stats.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <dd className="text-xl font-extrabold text-primary sm:text-2xl">{s.value}</dd>
                <dt className="mt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-[11px] sm:tracking-wider">
                  {s.label}
                </dt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-5 text-2xl font-extrabold text-foreground sm:text-3xl">
              About My Upwork Services
            </h2>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground">{u.about}</p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {u.highlights.map((h) => (
              <RevealItem
                key={h.title}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <h3 className="mb-2 text-base font-bold text-foreground">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-extrabold text-foreground sm:text-3xl">
              Specialized Services
            </h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive PPC management tailored for Upwork clients.
            </p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {u.services.map((s) => (
              <RevealItem
                as="article"
                key={s.title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <h3 className="mb-2 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <ul className="space-y-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/70" />
                      {i}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-4xl">
              How to Work With Me
            </h2>
            <p className="text-muted-foreground">A streamlined process for maximum efficiency.</p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-primary/30 md:block" />
            {u.process.map((step, i) => (
              <Reveal key={step.title} y={20} delay={i * 0.1} amount={0.2} className="relative text-center">
                <div className="relative z-10 mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-background text-primary">
                  <Icon name={step.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-4xl">
              Client Feedback
            </h2>
            <p className="text-muted-foreground">What my Upwork clients say about my work.</p>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {u.reviews.map((r) => (
              <RevealItem
                key={r.name}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <Quote className="mb-4 h-8 w-8 text-primary/40" />
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{r.feedback}&rdquo;
                </p>
                <p className="text-sm font-bold text-foreground">{r.name}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-extrabold text-foreground md:text-4xl">
            Ready to Scale Your Business?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            I offer flexible engagement models including hourly consulting, project-based setups,
            and monthly retainer packages. Let&apos;s discuss what works best for your goals.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={siteConfig.socials.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#14a800] px-6 text-sm font-bold text-white shadow-[0_0_15px_rgba(20,168,0,0.4)] transition-all hover:bg-[#14a800]/90"
            >
              Hire Me on Upwork <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Schedule Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
