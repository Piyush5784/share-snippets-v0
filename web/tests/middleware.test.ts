import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn().mockResolvedValue(null) }));

const { middleware } = await import("@/middleware");

// The general rate limiter is keyed by IP and shared across every request
// middleware sees. Give each test (unless it's deliberately reusing one to
// test the limiter itself) its own fake IP so tests can't bleed into each
// other's budget.
let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function req(url: string, init: RequestInit = {}, ip = nextIp()) {
  return new NextRequest(url, {
    ...init,
    headers: { ...(init.headers as Record<string, string> | undefined), "x-forwarded-for": ip },
  });
}

describe("middleware route protection", () => {
  it("treats '/' as public even without a session", async () => {
    const res = await middleware(req("http://localhost/"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("still treats the explicit public routes as public", async () => {
    const res = await middleware(req("http://localhost/pages/login"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("does NOT treat other routes as public and redirects to login (regression: startsWith('/') used to match every path, so nothing was ever protected)", async () => {
    const res = await middleware(req("http://localhost/pages/snippets/my"));

    const location = res.headers.get("location");
    expect(location).not.toBeNull();
    expect(location).toContain("/pages/login");
  });

  it("redirects protected API-shaped paths too when unauthenticated", async () => {
    const res = await middleware(req("http://localhost/api/snippets"));

    expect(res.headers.get("location")).not.toBeNull();
  });

  it("treats /api/auth/* as public (regression: useSession() polling /api/auth/session got redirected to the HTML login page instead of getting session JSON)", async () => {
    const res = await middleware(req("http://localhost/api/auth/session"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("treats /api/register as public (regression: signup requires no prior session by definition)", async () => {
    const res = await middleware(req("http://localhost/api/register"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("treats /api/extension/* as public (regression: the VS Code extension authenticates via its own Bearer API-key JWT, not a browser session cookie it doesn't have)", async () => {
    const res = await middleware(
      req("http://localhost/api/extension/snippets", {
        headers: { Authorization: "some-api-key-jwt" },
      })
    );
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("middleware rate limiting", () => {
  it("rate-limits /api/extension after exceeding its per-key budget (60/min)", async () => {
    const ip = nextIp();
    const key = "rate-limit-test-key";
    const makeReq = () =>
      req(
        "http://localhost/api/extension/snippets",
        { headers: { Authorization: key } },
        ip
      );

    for (let i = 0; i < 60; i++) {
      const res = await middleware(makeReq());
      expect(res.status).not.toBe(429);
    }

    const limited = await middleware(makeReq());
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBeTruthy();
  });

  it("rate-limits /api/extension per key, not globally - a different key still gets through", async () => {
    const res = await middleware(
      req("http://localhost/api/extension/snippets", {
        headers: { Authorization: "a-totally-different-key" },
      })
    );
    expect(res.status).not.toBe(429);
  });

  it("rate-limits /api/register more tightly than the general limit (5/10min)", async () => {
    const ip = nextIp();
    const makeReq = () => req("http://localhost/api/register", {}, ip);

    for (let i = 0; i < 5; i++) {
      const res = await middleware(makeReq());
      expect(res.status).not.toBe(429);
    }

    const limited = await middleware(makeReq());
    expect(limited.status).toBe(429);
  });

  it("applies the general per-IP limit across ordinary page/API requests too (120/min)", async () => {
    const ip = nextIp();
    // Mix path shapes to prove this isn't scoped to one route - the general
    // limiter runs before any route-specific check.
    const paths = ["http://localhost/", "http://localhost/pages/login", "http://localhost/api/auth/session"];

    for (let i = 0; i < 120; i++) {
      const res = await middleware(req(paths[i % paths.length], {}, ip));
      expect(res.status).not.toBe(429);
    }

    const limited = await middleware(req("http://localhost/", {}, ip));
    expect(limited.status).toBe(429);
  });

  it("general limit is isolated per IP - a different IP is unaffected", async () => {
    const res = await middleware(req("http://localhost/"));
    expect(res.status).not.toBe(429);
  });
});
