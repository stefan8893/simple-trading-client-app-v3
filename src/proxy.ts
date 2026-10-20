import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const isExpiredSessionRedirect =
    pathname === "/" &&
    request.nextUrl.searchParams.get("auth") === "required";

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
