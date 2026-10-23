import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  getAuth: () => ({ api: { getSession } }),
}));

import { proxy } from "@/proxy";

describe("proxy", () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it("starts OAuth directly and preserves the requested app route", async () => {
    const response = proxy(
      new NextRequest("https://example.test/settings?theme=dark"),
    );

    const resolvedResponse = await response;
    expect(resolvedResponse.status).toBe(307);
    expect(resolvedResponse.headers.get("location")).toBe(
      "https://example.test/api/auth/start?callbackURL=%2Fsettings%3Ftheme%3Ddark",
    );
  });

  it("rewrites the landing page to home when the session is valid", async () => {
    getSession.mockResolvedValue({ session: {}, user: {} });
    const request = new NextRequest("https://example.test/", {
      headers: {
        cookie: "session-token=opaque",
      },
    });
    const response = await proxy(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://example.test/home",
    );
    expect(getSession).toHaveBeenCalledOnce();
  });

  it("allows a protected route when the session is valid", async () => {
    getSession.mockResolvedValue({ session: {}, user: {} });
    const request = new NextRequest("https://example.test/home", {
      headers: {
        cookie: "session-token=opaque",
      },
    });
    const response = await proxy(request);

    expect(response.headers.get("location")).toBeNull();
    expect(getSession).toHaveBeenCalledOnce();
  });

  it("starts OAuth when a protected route has an invalid session cookie", async () => {
    getSession.mockResolvedValue(null);
    const request = new NextRequest("https://example.test/settings?tab=account", {
      headers: {
        cookie: "session-token=invalid",
      },
    });
    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.test/api/auth/start?callbackURL=%2Fsettings%3Ftab%3Daccount",
    );
    expect(getSession).toHaveBeenCalledOnce();
  });
});
