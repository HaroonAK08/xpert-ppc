import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/seo';

export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumb trail plus matching BreadcrumbList structured data —
 * both matter for search result presentation.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items];

  const schema = breadcrumbSchema(
    trail.map((c, i) => ({
      name: c.label,
      path: c.href ?? (i === trail.length - 1 ? '' : '/'),
    }))
  );

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-primary/80">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            const isHome = i === 0;
            return (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                  >
                    {isHome ? <Home className="h-3.5 w-3.5" aria-hidden /> : null}
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={last ? 'text-primary' : undefined}
                    aria-current={last ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
                {!last ? <ChevronRight className="h-3 w-3 opacity-60" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;
