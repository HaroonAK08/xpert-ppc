import Link from 'next/link';
import { Youtube, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import { Logo } from './logo';
import { SOCIAL_LINKS } from '@/lib/socials';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About Me' },
  { href: '/#my-team', label: 'My Team' },
  { href: '/login', label: 'Login' },
];

const LEGAL_LINKS = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms' },
  { href: `mailto:${SOCIAL_LINKS.email}`, label: 'Contact' },
];

const SOCIALS = [
  { icon: Youtube, label: 'YouTube', color: 'bg-[#FF0000]', href: SOCIAL_LINKS.youtube },
  { icon: Linkedin, label: 'LinkedIn', color: 'bg-[#0A66C2]', href: SOCIAL_LINKS.linkedin },
  { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]', href: SOCIAL_LINKS.facebook },
  { icon: MessageCircle, label: 'WhatsApp', color: 'bg-[#25D366]', href: SOCIAL_LINKS.whatsapp },
];

function SocialRow({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {SOCIALS.map(({ icon: Icon, label, color, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={label}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:scale-105 ${color}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-5">
      {SOCIALS.map(({ icon: Icon, label, color, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="group flex w-[70px] flex-col items-center gap-[5px]"
        >
          <span
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-full text-white shadow-sm transition group-hover:scale-105 ${color}`}
          >
            <Icon className="h-[16px] w-[16px]" />
          </span>
          <span className="text-center text-[10px] font-medium leading-tight text-white/70">{label}</span>
        </a>
      ))}
    </div>
  );
}

export function SiteFooter({ variant = 'default' }: { variant?: 'default' | 'legal' | 'course' }) {
  if (variant === 'legal') {
    return (
      <footer className="mt-auto bg-[#071833] text-white">
        <div className="page flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <Logo dark href={null} />
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.label} className="inline-flex items-center gap-3">
                {i > 0 ? <span className="text-white/25">|</span> : null}
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
          <SocialRow compact />
        </div>
      </footer>
    );
  }

  if (variant === 'course') {
    return (
      <footer className="mt-auto bg-[#071833] text-white">
        <div className="page flex flex-col gap-8 py-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo dark href={null} />
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Learn practical digital marketing skills for a brighter future.
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <SocialRow />
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/75">
              {[...LINKS, { href: '/signup', label: 'Join Now' }].map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto bg-[#071833] text-white">
      <div className="page flex flex-col gap-6 py-[36px] lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <Logo dark href={null} />

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium text-white/80">
          {LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hidden h-10 w-px bg-white/15 lg:block" aria-hidden />
          <SocialRow />
        </div>
      </div>
    </footer>
  );
}
