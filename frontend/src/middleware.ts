import { NextResponse, type NextRequest } from 'next/server';
import {
  COM_ORIGIN,
  COURSES_ORIGIN,
  isCoursePath,
  isCoursesHost,
} from '@/lib/site-href';

function isStaticOrAsset(pathname: string): boolean {
  return (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.startsWith('/og-') ||
    pathname.startsWith('/team/') ||
    pathname.startsWith('/case-studies') ||
    pathname.startsWith('/uploads')
  );
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const { pathname, search } = req.nextUrl;

  // Agency / other hosts: send course URLs to .net
  if (!isCoursesHost(host)) {
    if (isCoursePath(pathname)) {
      return NextResponse.redirect(`${COURSES_ORIGIN}${pathname}${search}`, 308);
    }
    return NextResponse.next();
  }

  // Courses site (xpertppc.net)
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/courses';
    return NextResponse.rewrite(url);
  }

  if (isCoursePath(pathname) || isStaticOrAsset(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(`${COM_ORIGIN}${pathname}${search}`, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)'],
};
