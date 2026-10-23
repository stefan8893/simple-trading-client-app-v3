import { NextResponse } from "next/server";

import { getAuth } from "@/lib/auth/auth";

export async function GET(request: Request) {
  const requestURL = new URL(request.url);
  const callbackURL = getSafeCallbackURL(
    requestURL.searchParams.get("callbackURL"),
  );
  const authHeaders = new Headers(request.headers);
  authHeaders.set("origin", requestURL.origin);

  const { headers, response: result } = await getAuth().api.signInSocial({
    body: {
      provider: "microsoft",
      callbackURL,
    },
    headers: authHeaders,
    returnHeaders: true,
  });

  if (!result.url) {
    throw new Error(
      "Better Auth did not return a Microsoft authorization URL.",
    );
  }

  const response = NextResponse.redirect(result.url);
  for (const cookie of headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

function getSafeCallbackURL(callbackURL: string | null) {
  if (
    !callbackURL ||
    !callbackURL.startsWith("/") ||
    callbackURL.startsWith("//") ||
    callbackURL.includes("\\")
  ) {
    return "/home";
  }

  const url = new URL(callbackURL, "http://localhost");
  return url.origin === "http://localhost"
    ? `${url.pathname}${url.search}${url.hash}`
    : "/home";
}
