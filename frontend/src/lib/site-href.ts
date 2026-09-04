export const COM_ORIGIN = 'https://xpertppc.com';
export const NET_ORIGIN = 'https://xpertppc.net';

export function isNetHost(host: string | null | undefined): boolean {
  return (host || '').toLowerCase().includes('xpertppc.net');
}

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
 * - On xpertppc.com: send leftover course paths to .net; keep agency paths local
 */
export function publicHref(href: string, host?: string | null): string {
  if (!href.startsWith('/')) return href;

  const pathOnly = href.split(/[?#]/)[0] || '/';
  const suffix = href.slice(pathOnly.length);

  if (isNetHost(host)) {
    if (pathOnly === '/' || pathOnly.startsWith('/#')) return href;
    if (isCoursePath(pathOnly)) return href;
    return `${COM_ORIGIN}${pathOnly}${suffix}`;
  }

  if (isCoursePath(pathOnly)) return `${NET_ORIGIN}${pathOnly}${suffix}`;
  return href;
}
