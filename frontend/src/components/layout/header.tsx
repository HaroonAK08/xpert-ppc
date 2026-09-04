'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSiteHref } from '@/hooks/use-site-href';
import { coursesNav, mainNav } from '@/lib/site';
import { COM_ORIGIN } from '@/lib/site-href';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { WhatsAppNumberButton } from './whatsapp-number-button';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/' || pathname === '/courses';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Header() {
  const pathname = usePathname() || '';
  const { to, isNet } = useSiteHref();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isAdsLanding = pathname.startsWith('/ads');
  const isLpLanding = pathname.startsWith('/lp');

  if (isLpLanding) {
    const site = 'https://xpertppc.com';
    const nav = [
      { label: 'Home', href: `${site}/` },
      { label: 'Services', href: `${site}/services` },
      { label: 'Results', href: `${site}/case-study` },
      { label: 'About', href: `${site}/about` },
      { label: 'FAQs', href: `${site}/faq` },
    ];

    return (
      <header
        className={cn(
          'fixed top-0 z-50 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-slate-200/80 bg-white/95 shadow-sm backdrop-blur'
            : 'border-transparent bg-white'
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <a href={site} className="inline-flex shrink-0 items-center gap-2.5" aria-label="Xpert PPC">
            <img
              src="/favicon-192.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-[#0b1f4d] sm:text-xl">
                Xpert <span className="text-[#1d6ff2]">PPC</span>
              </span>
              <span className="hidden text-[10px] font-semibold tracking-wide text-slate-500 sm:block">
                Grow. Scale. Get Patients.
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#1d6ff2]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/923004021417?text=Hi%20Xpert%20PPC%2C%20I%27d%20like%20a%20free%20clinic%20marketing%20audit."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center justify-center rounded-full border border-[#1d6ff2] px-4 text-sm font-bold text-[#1d6ff2] transition-colors hover:bg-[#1d6ff2]/10 sm:inline-flex"
            >
              Book a Strategy Call
            </a>
            <a
              href="#audit-form"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#1d6ff2] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1558c7] sm:text-sm"
            >
              Get a Free Audit
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    );
  }

  if (isAdsLanding) {
    return (
      <header
        className={cn(
          'fixed top-0 z-50 w-full border-b bg-background transition-all duration-300',
          scrolled ? 'border-primary/20 shadow-lg shadow-background/50' : 'border-transparent'
        )}
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:h-20">
            <Logo className="shrink-0" />
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <WhatsAppNumberButton size="sm" hideNumberOnMobile />
              <a
                href="#audit-form"
                className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 sm:px-6 sm:text-sm"
              >
                <span className="sm:hidden">Free audit</span>
                <span className="hidden sm:inline">Book a strategy session</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isNet) {
    return (
      <header
        className={cn(
          'fixed top-0 z-50 w-full border-b bg-background transition-all duration-300',
          scrolled ? 'border-primary/20 shadow-lg shadow-background/50' : 'border-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <nav className="hidden items-center space-x-6 lg:flex" aria-label="Courses">
              {coursesNav.map((item) => (
                <Link
                  key={item.href}
                  href={to(item.href)}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={cn(
                    'border-b-2 pb-1 text-sm font-semibold transition-colors duration-300',
                    isActive(pathname, item.href)
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-foreground hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-3 lg:flex">
              <a
                href={COM_ORIGIN}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                Agency site
              </a>
              <Link
                href={to('/courses/signup')}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
              >
                Apply
              </Link>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
              <Link
                href={to('/courses/signup')}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
              >
                Apply
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 text-foreground transition-colors hover:text-primary"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen ? (
          <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-primary/20 bg-background lg:hidden">
            <nav className="container mx-auto flex flex-col px-4 py-4" aria-label="Courses mobile">
              {coursesNav.map((item) => (
                <Link
                  key={item.href}
                  href={to(item.href)}
                  className={cn(
                    'block border-b border-primary/10 py-3 text-sm font-semibold transition-colors',
                    isActive(pathname, item.href)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={COM_ORIGIN}
                className="mt-4 block py-3 text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                Agency site → xpertppc.com
              </a>
            </nav>
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full border-b bg-background transition-all duration-300',
        scrolled ? 'border-primary/20 shadow-lg shadow-background/50' : 'border-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center space-x-6 lg:flex xl:space-x-8" aria-label="Main">
            {mainNav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    aria-expanded={openDropdown === item.label}
                    onClick={() =>
                      setOpenDropdown((cur) => (cur === item.label ? null : item.label))
                    }
                    className={cn(
                      'flex items-center gap-1 border-b-2 pb-1 text-sm font-semibold transition-colors duration-300',
                      isActive(pathname, '/industries')
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-foreground hover:text-primary'
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        openDropdown === item.label && 'rotate-180'
                      )}
                    />
                  </button>

                  {openDropdown === item.label ? (
                    <div className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4">
                      <div className="max-h-[70vh] overflow-y-auto overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={to(child.href)}
                            className="block px-5 py-4 transition-colors hover:bg-primary/10"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={to(item.href)}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={cn(
                    'border-b-2 pb-1 text-sm font-semibold transition-colors duration-300',
                    isActive(pathname, item.href)
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-foreground hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <WhatsAppNumberButton size="sm" />
            <Link
              href={to('/contact')}
              className="btn-hover-effect inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Book a Call
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <WhatsAppNumberButton size="sm" className="max-[380px]:px-2.5" />
            <Link
              href={to('/contact')}
              className="hidden h-10 items-center justify-center rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 sm:inline-flex sm:px-4"
            >
              Free Audit
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-foreground transition-colors hover:text-primary"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-primary/20 bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-4 sm:px-6" aria-label="Mobile">
            {mainNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={to(item.href)}
                  className={cn(
                    'block border-b border-primary/10 py-3 text-sm font-semibold transition-colors',
                    isActive(pathname, item.href)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={to(child.href)}
                    className="block border-b border-primary/10 py-2.5 pl-4 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <WhatsAppNumberButton className="mt-4 w-full" />
            <Link
              href={to('/contact')}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
            >
              Book a Call
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
