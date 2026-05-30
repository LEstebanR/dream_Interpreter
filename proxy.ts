import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];
const PROTECTED_ROUTES = ['/journal', '/profile', '/billing'];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';

  // getToken reads the JWT directly without triggering the session callback,
  // which would execute a DB query — not safe in Edge Runtime (no TCP access).
  // In Auth.js v5, tokens are JWE-encrypted. The cookie name (used as salt for
  // decryption) differs by protocol: __Secure- prefix is added on HTTPS (production).
  const isSecure = req.nextUrl.protocol === 'https:';
  const cookieName = isSecure
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName,
    salt: cookieName,
  });
  const isAuthenticated = !!token;

  const localeMatch = pathname.match(/^\/(es|en)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  if (
    isAuthenticated &&
    AUTH_ROUTES.some(
      (route) =>
        pathnameWithoutLocale === route ||
        pathnameWithoutLocale.startsWith(route + '/')
    )
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (
    !isAuthenticated &&
    PROTECTED_ROUTES.some(
      (route) =>
        pathnameWithoutLocale === route ||
        pathnameWithoutLocale.startsWith(route + '/')
    )
  ) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
