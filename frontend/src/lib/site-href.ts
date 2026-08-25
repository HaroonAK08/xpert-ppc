export const COM_ORIGIN = 'https://xpertppc.com';

export function isNetHost(host: string | null | undefined): boolean {
  return (host || '').toLowerCase().includes('xpertppc.net');
}

/** On xpertppc.net, keep Home on .net; send every other internal path to .com. */
export function publicHref(href: string, host?: string | null): string {
  if (!isNetHost(host)) return href;
  if (!href.startsWith('/')) return href;
  if (href === '/' || href.startsWith('/#')) return href;
  return `${COM_ORIGIN}${href}`;
}
