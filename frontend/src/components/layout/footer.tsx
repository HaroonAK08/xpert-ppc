'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  Facebook,
  GraduationCap,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Youtube,
  Briefcase,
  Users,
} from 'lucide-react';
import { useSiteHref } from '@/hooks/use-site-href';
import { footerNav, legalNav, siteConfig } from '@/lib/site';
import { Logo } from './logo';
import { WhatsAppNumberButton } from './whatsapp-number-button';

const socialLinks = [
  { href: siteConfig.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: siteConfig.socials.facebook, label: 'Facebook', Icon: Facebook },
  { href: siteConfig.socials.youtube, label: 'YouTube', Icon: Youtube },
  { href: siteConfig.socials.upwork, label: 'Upwork', Icon: Briefcase },
  { href: siteConfig.socials.upworkAgency, label: 'Upwork Agency', Icon: Users },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const to = useSiteHref();
  return (
    <Link
      href={to(href)}
      className="group flex items-start text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-accent"
    >
      <ExternalLink className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      <span>{children}</span>
    </Link>
  );
}

export function Footer() {
  const pathname = usePathname() || '';
  const to = useSiteHref();

  if (pathname.startsWith('/lp')) {
    return (
      <footer className="border-t border-slate-200 bg-[#0b1f4d] pb-24 pt-10 text-white md:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/70 md:flex-row">
            <a href="https://xpertppc.com" className="font-bold text-white hover:text-white">
              Xpert PPC
            </a>
            <p>&copy; {new Date().getFullYear()} Xpert PPC. Digital marketing for clinics.</p>
            <a
              href="https://xpertppc.com/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <a
              href={`tel:${siteConfig.contact.phonePrimaryRaw}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-sky-300"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {siteConfig.contact.phonePrimary}
            </a>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${label} profile`}
                  title={label}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (pathname.startsWith('/ads')) {
    return (
      <footer className="border-t border-border bg-background pb-24 pt-8 text-foreground md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <WhatsAppNumberButton size="sm" />
            <p>&copy; {new Date().getFullYear()} Xpert PPC. Engineered for Growth.</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legalNav.map((l) => (
                <Link key={l.href} href={to(l.href)} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background pb-24 pt-16 text-foreground md:pb-8">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="mb-6" />
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              {siteConfig.tagline}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We scale brands with precision targeting and accountable optimization across major ad
              platforms.
            </p>
          </div>

          <div>
            <span className="mb-6 flex items-center gap-2 text-lg font-bold text-primary">
              <GraduationCap className="h-5 w-5" />
              {footerNav.academy.title}
            </span>
            <nav className="flex flex-col space-y-4">
              {footerNav.academy.links.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <span className="mb-6 block text-lg font-bold text-primary">
              {footerNav.company.title}
            </span>
            <nav className="flex flex-col space-y-4">
              {footerNav.company.links.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <span className="mb-6 block text-lg font-bold text-primary">Contact</span>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-start gap-2">
                <WhatsAppNumberButton size="sm" />
                <WhatsAppNumberButton
                  size="sm"
                  phone={siteConfig.contact.phoneSecondary}
                  phoneRaw={siteConfig.contact.phoneSecondaryRaw}
                />
              </div>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center space-x-3 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span>{siteConfig.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="mb-8 flex flex-col items-center md:items-start">
            <span className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground opacity-80">
              Connect With Us
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
              <a
                href={`tel:${siteConfig.contact.phonePrimaryRaw}`}
                aria-label={`Call ${siteConfig.contact.phonePrimary}`}
                title={siteConfig.contact.phonePrimary}
                className="group relative inline-flex items-center gap-2 text-foreground transition-all duration-300 hover:scale-[1.05] hover:text-primary hover:drop-shadow-[0_0_12px_rgba(0,102,204,0.6)]"
              >
                <Phone className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{siteConfig.contact.phonePrimary}</span>
              </a>
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${label} profile`}
                  title={label}
                  className="group relative text-foreground transition-all duration-300 hover:scale-[1.2] hover:text-primary hover:drop-shadow-[0_0_12px_rgba(0,102,204,0.6)]"
                >
                  <Icon className="h-5 w-5" />
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>&copy; {new Date().getFullYear()} Xpert PPC. Engineered for Growth.</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legalNav.map((l) => (
                <Link key={l.href} href={to(l.href)} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
