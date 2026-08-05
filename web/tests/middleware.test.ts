import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn().mockResolvedValue(null) }));

const { middleware } = await import("@/middleware");

describe("middleware route protection", () => {
  it("treats '/' as public even without a session", async () => {
    const res = await middleware(new NextRequest("http://localhost/"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("still treats the explicit public routes as public", async () => {
    const res = await middleware(new NextRequest("http://localhost/pages/login"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("does NOT treat other routes as public and redirects to login (regression: startsWith('/') used to match every path, so nothing was ever protected)", async () => {
    const res = await middleware(new NextRequest("http://localhost/pages/snippets/my"));

    const location = res.headers.get("location");
    expect(location).not.toBeNull();
    expect(location).toContain("/pages/login");
  });

  it("redirects protected API-shaped paths too when unauthenticated", async () => {
    const res = await middleware(new NextRequest("http://localhost/api/snippets"));

    expect(res.headers.get("location")).not.toBeNull();
  });

  it("treats /api/auth/* as public (regression: useSession() polling /api/auth/session got redirected to the HTML login page instead of getting session JSON)", async () => {
    const res = await middleware(new NextRequest("http://localhost/api/auth/session"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("treats /api/register as public (regression: signup requires no prior session by definition)", async () => {
    const res = await middleware(new NextRequest("http://localhost/api/register"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("treats /api/extension/* as public (regression: the VS Code extension authenticates via its own Bearer API-key JWT, not a browser session cookie it doesn't have)", async () => {
    const res = await middleware(
      new NextRequest("http://localhost/api/extension/snippets", {
        headers: { Authorization: "some-api-key-jwt" },
      })
    );
    expect(res.headers.get("location")).toBeNull();
  });
});
