import { type NextRequest, NextResponse } from "next/server";

import { getAuth } from "@/lib/auth/auth";
import { SESSION_COOKIE } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const session = hasSessionCookie
    ? await getAuth().api.getSession({ headers: request.headers })
    : null;

  if (!session && pathname !== "/") {
    const authStartUrl = new URL("/api/auth/start", request.url);
    authStartUrl.searchParams.set(
      "callbackURL",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(authStartUrl);
  }

  if (pathname === "/" && session) {
    return NextResponse.rewrite(new URL("/home", request.url), {
      request: { headers: withReturnTo(request, "/home") },
    });
  }

  return NextResponse.next({
    request: {
      headers: withReturnTo(request, `${pathname}${request.nextUrl.search}`),
    },
  });
}

function withReturnTo(request: NextRequest, returnTo: string) {
  const headers = new Headers(request.headers);
  headers.set("x-auth-return-to", returnTo);

  return headers;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|\\.swa|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
