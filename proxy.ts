import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Rutas de auth: usuarios autenticados deben ser redirigidos al home
const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

// Rutas protegidas: requieren sesión activa
const PROTECTED_ROUTES = ['/journal', '/profile', '/billing'];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Quitar el prefijo de locale (/es o /en) para comparar rutas
  const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';

  // Leer JWT directamente sin activar session callback (evita query a BD en Edge runtime)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Extraer locale del pathname para construir URLs de redirección correctas
  const localeMatch = pathname.match(/^\/(es|en)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Usuario autenticado intentando acceder a rutas de auth → redirigir al home
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

  // Usuario no autenticado intentando acceder a rutas protegidas → redirigir a sign-in
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
