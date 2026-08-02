import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ExternalLink, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LoadFade, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { umerKhan as m } from '@shared/content/team';
import { buildMetadata, personSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: m.seo.title,
  description: m.seo.description,
  path: '/team/umer-khan',
  keywords: m.seo.keywords,
  type: 'profile',
});

export default function TeamMemberPage() {
  return (
    <>
      <JsonLd
        data={personSchema({
          name: m.name,
          role: m.role,
          description: m.bio,
          path: '/team/umer-khan',
          image: m.photo,
          sameAs: [m.socials.linkedin, m.socials.upwork],
        })}
      />

      <section className="relative overflow-hidden bg-background pb-16 pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Team' }, { label: m.name }]} />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <LoadFade className="lg:col-span-1" scale={0.95}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="relative mx-auto mb-6 aspect-square w-40 overflow-hidden rounded-2xl border border-primary/20">
                  <Image
                    src={m.photo}
                    alt={`${m.name}, ${m.role} at Xpert PPC`}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>

                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
                  Contact {m.name.split(' ')[0]}
                </h2>
                <div className="space-y-3">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0" /> {siteConfig.contact.email}
                  </a>
                  <a
                    href={`tel:${siteConfig.contact.phonePrimaryRaw}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 shrink-0" /> {siteConfig.contact.phonePrimary}
                  </a>
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp Chat
                  </a>
                  <a
                    href={m.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 shrink-0" /> LinkedIn Profile
                  </a>
                </div>
              </div>
            </LoadFade>

            <LoadFade delay={0.15} className="lg:col-span-2">
              <h1 className="mb-2 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
                {m.name}
              </h1>
              <p className="mb-6 text-lg font-semibold text-primary">{m.role}</p>
              <p className="mb-10 text-base leading-relaxed text-muted-foreground">{m.bio}</p>

              <RevealGroup stagger={0.12} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <RevealItem>
                  <h2 className="mb-4 text-xl font-extrabold text-foreground">Core Expertise</h2>
                  <ul className="space-y-3">
                    {m.expertise.map((e) => (
                      <li key={e} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{e}</span>
                      </li>
                    ))}
                  </ul>
                </RevealItem>

                <RevealItem>
                  <h2 className="mb-4 text-xl font-extrabold text-foreground">Key Achievements</h2>
                  <ul className="space-y-3">
                    {m.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-sm text-muted-foreground">{a}</span>
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              </RevealGroup>
            </LoadFade>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-extrabold text-foreground sm:text-3xl">
            Work with {m.name}
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/google-ads-expert-upwork-umer-khan"
              className="btn-hover-effect inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Hire Me on Upwork <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
