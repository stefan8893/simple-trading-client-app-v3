import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(SESSION_COOKIE)?.value === "1";

  if (!isAuthenticated && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && pathname === "/") {
    return NextResponse.rewrite(new URL("/home", request.url));
  }

  if (isAuthenticated && pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/((?!.swa).*)",
  ],
};
