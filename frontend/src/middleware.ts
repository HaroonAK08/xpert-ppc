import { NextResponse, type NextRequest } from 'next/server';
import { COM_ORIGIN, isNetHost } from '@/lib/site-href';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  if (!isNetHost(host)) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.startsWith('/og-') ||
    pathname.startsWith('/team/') ||
    pathname.startsWith('/case-studies')
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(`${COM_ORIGIN}${pathname}${search}`, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)'],
};
