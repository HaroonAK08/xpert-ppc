export function loginDestination(fallback: string, section: '/dashboard' | '/admin'): string {
  const next = new URLSearchParams(window.location.search).get('next');
  if (!next) return fallback;
  try {
    const target = new URL(next, window.location.origin);
    if (target.origin !== window.location.origin || !(target.pathname === section || target.pathname.startsWith(`${section}/`)) || target.pathname === '/admin/login') return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch { return fallback; }
}

export function signInPath(login: string) {
  return `${login}?next=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
}
