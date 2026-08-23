'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { mainNav } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { WhatsAppNumberButton } from './whatsapp-number-button';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Header() {
  const pathname = usePathname() || '';
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

  const isLanding = pathname.startsWith('/ads');

  if (isLanding) {
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
                            href={child.href}
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
                  href={item.href}
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
              href="/contact"
              className="btn-hover-effect inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Book a Call
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <WhatsAppNumberButton size="sm" className="max-[380px]:px-2.5" />
            <Link
              href="/contact"
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
                  href={item.href}
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
                    href={child.href}
                    className="block border-b border-primary/10 py-2.5 pl-4 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <WhatsAppNumberButton className="mt-4 w-full" />
            <Link
              href="/contact"
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
