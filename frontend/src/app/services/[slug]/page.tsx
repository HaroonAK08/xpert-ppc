import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { Icon } from '@/components/icon';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LeadForm } from '@/components/forms/lead-form';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, LoadGroup, LoadItem, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { getService, services } from '@shared/content/services';
import { buildMetadata, serviceSchema } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
    keywords: [
      `${service.name} management`,
      `${service.name} agency`,
      ...service.features.map((f) => f.toLowerCase()),
    ],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const { detail } = service;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: `${service.name} Management`,
          description: service.seo.description,
          path: `/services/${service.slug}`,
        })}
      />

      <section className="relative overflow-hidden bg-background pb-16 pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Services', href: '/services' }, { label: service.name }]}
          />

          <LoadGroup className="max-w-4xl">
            <LoadItem className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={service.icon} className="h-6 w-6" />
            </LoadItem>

            <LoadItem
              as="h1"
              y={20}
              className="mb-5 text-3xl font-extrabold leading-tight text-foreground md:text-5xl"
            >
              {detail.heroTitle}
            </LoadItem>

            <LoadItem as="p" y={20} className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {detail.subheading}
            </LoadItem>

            <LoadItem>
              <Link
                href="#consultation"
                className="btn-hover-effect inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Get {service.name} Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </LoadItem>
          </LoadGroup>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
          {detail.detailedServices.map((d, i) => (
            <Reveal
              key={d.title}
              y={24}
              duration={0.5}
              margin="-100px"
              amount={0.2}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${
                i % 2 === 1 ? 'lg:[&>figure]:order-first' : ''
              }`}
            >
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-foreground">{d.title}</h2>
                <p className="text-base leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-[0_0_40px_-12px_hsla(var(--primary),0.35)]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 rounded-full bg-primary/15 blur-3xl" />
                <Image
                  src={`${d.image}?auto=format&fit=crop&w=1200&q=75`}
                  alt={`${d.title} — ${service.name} campaign management by Xpert PPC`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  priority={i === 0}
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal y={20} amount={0.3}>
            <h2 className="mb-6 text-xl font-extrabold text-foreground">Core Capabilities</h2>
            <ul className="space-y-3">
              {detail.whatWeOffer.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal y={20} delay={0.1} amount={0.3}>
            <h2 className="mb-6 text-xl font-extrabold text-foreground">Why Xpert PPC</h2>
            <ul className="space-y-3">
              {detail.whyChooseUs.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="mb-10 text-center text-2xl font-extrabold text-foreground sm:text-3xl">
            Our {service.name} Process
          </Reveal>
          <RevealGroup as="ol" stagger={0.08} className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {detail.process.map((step, i) => (
              <RevealItem
                key={step}
                as="li"
                className="rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/40"
              >
                <span className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-primary">
                  Step {i + 1}
                </span>
                <span className="text-sm font-bold text-foreground">{step}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="consultation" className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadFade className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-center text-2xl font-extrabold text-foreground sm:text-3xl">
              Initialize {service.name} Strategy
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Connect with our specialists to engineer a high-performance campaign structure.
            </p>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04]" />
              <div className="relative">
                <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted/40" />}>
                  <LeadForm source="service-page" defaultPlatform={service.name} />
                </Suspense>
              </div>
            </div>
          </LoadFade>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Want to work directly with a senior specialist?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Our campaigns are engineered by industry veterans.
          </p>
          <Link
            href="/team/umer-khan"
            className="inline-flex items-center justify-center font-bold text-accent transition-colors hover:text-primary"
          >
            Meet Umer Khan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
