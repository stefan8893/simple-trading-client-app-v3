"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AUTH_STORAGE_KEY = "isAuthenticated";
const SESSION_COOKIE = "session_token";

export function LocalStorageAuthCookieSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated =
      window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    const hasSessionCookie = document.cookie
      .split("; ")
      .some((cookie) => cookie === `${SESSION_COOKIE}=1`);

    if (isAuthenticated === hasSessionCookie) {
      return;
    }

    if (isAuthenticated) {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${SESSION_COOKIE}=1; Path=/; SameSite=Lax${secure}`;
    } else {
      document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    }

    router.refresh();
  }, [pathname, router]);

  return null;
}
