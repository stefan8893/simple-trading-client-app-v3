import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // This is only an optimistic redirect; AppLayout validates protected-route sessions.
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const isExpiredSessionRedirect =
    pathname === "/" && request.nextUrl.searchParams.get("auth") === "required";

  if (!hasSessionCookie && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (hasSessionCookie && pathname === "/" && !isExpiredSessionRedirect) {
    return NextResponse.rewrite(new URL("/home", request.url));
  }

  if (hasSessionCookie && pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|\\.swa|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
