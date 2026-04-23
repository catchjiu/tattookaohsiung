import { NextRequest, NextResponse } from "next/server";

/**
 * Sets an `x-locale` header on every request so the root Server Component
 * layout can read the current locale and:
 *   1. Set `<html lang="...">` correctly in the SSR response
 *   2. Pass `initialLocale` to LanguageProvider so Chinese pages are
 *      rendered in Chinese from the very first byte Google sees.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isZhTW = pathname.startsWith("/zh-TW");

  // Propagate locale as a request header so Server Components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isZhTW ? "zh-TW" : "en");

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
