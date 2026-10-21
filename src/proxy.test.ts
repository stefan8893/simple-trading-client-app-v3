import { NextRequest } from "next/server";

import { describe, expect, it } from "vitest";

import { proxy } from "@/proxy";

describe("proxy", () => {
  it("redirects unauthenticated visitors from app routes to the landing page", () => {
    const response = proxy(new NextRequest("https://example.test/settings"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.test/");
  });

  it("rewrites the landing page to home when a Better Auth cookie is present", () => {
    const request = new NextRequest("https://example.test/", {
      headers: {
        cookie: "session-token=opaque",
      },
    });
    const response = proxy(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://example.test/home",
    );
  });

  it("redirects a direct home visit to the landing page for signed-in users", () => {
    const request = new NextRequest("https://example.test/home", {
      headers: {
        cookie: "session-token=opaque",
      },
    });
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.test/");
  });

  it("does not rewrite the landing page after an invalid session is detected", () => {
    const request = new NextRequest("https://example.test/?auth=required", {
      headers: {
        cookie: "session-token=invalid",
      },
    });

    expect(proxy(request).headers.has("x-middleware-rewrite")).toBe(false);
  });
});
