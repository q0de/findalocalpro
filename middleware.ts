import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hasParams = searchParams.toString().length > 0;
  const response = NextResponse.next();

  // noindex any page with query params to prevent crawl waste
  // Canonical URLs (without params) remain fully indexable
  if (hasParams) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|images|icons|manifest|webmcp).*)',
  ],
};
