export const COM_ORIGIN = 'https://xpertppc.com';
/** Digital Academy / courses site. */
export const COURSES_ORIGIN = 'https://xpertppc.net';

export function isCoursesHost(host: string | null | undefined): boolean {
  const h = (host || '').toLowerCase();
  return h.includes('xpertppc.net');
}

/** @deprecated Use isCoursesHost */
export const isNetHost = isCoursesHost;
/** @deprecated Use COURSES_ORIGIN */
export const NET_ORIGIN = COURSES_ORIGIN;

export function isCoursePath(pathname: string): boolean {
  return (
    pathname === '/courses' ||
    pathname.startsWith('/courses/') ||
    pathname === '/xpert-ppc-digital-academy' ||
    pathname.startsWith('/xpert-ppc-digital-academy/')
  );
}

/**
 * Cross-host link helper.
 * - On xpertppc.net: keep home + course paths local; send agency paths to .com
 * - Elsewhere: send course paths to xpertppc.net
 */
export function publicHref(href: string, host?: string | null): string {
  if (!href.startsWith('/')) return href;

  const pathOnly = href.split(/[?#]/)[0] || '/';
  const suffix = href.slice(pathOnly.length);

  if (isCoursesHost(host)) {
    if (pathOnly === '/' || pathOnly.startsWith('/#')) return href;
    if (isCoursePath(pathOnly)) return href;
    return `${COM_ORIGIN}${pathOnly}${suffix}`;
  }

  if (isCoursePath(pathOnly)) return `${COURSES_ORIGIN}${pathOnly}${suffix}`;
  return href;
}
