import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NEXTAUTH_SECRET } from "./lib/config";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

if (!redis && process.env.NODE_ENV !== "test") {
  console.warn(
    "[middleware] UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set - rate limiting is disabled."
  );
}

const generalRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "60 s"),
      prefix: "ratelimit:general",
    })
  : null;

const registerRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "600 s"),
      prefix: "ratelimit:register",
    })
  : null;

const extensionRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "60 s"),
      prefix: "ratelimit:extension",
    })
  : null;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<NextResponse | null> {
  if (!limiter) return null; // no Redis configured - fail open, not closed

  const result = await limiter.limit(key);
  if (result.success) return null;

  return NextResponse.json(
    { message: "Too many requests - please slow down.", success: false },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(0, Math.ceil((result.reset - Date.now()) / 1000))),
      },
    }
  );
}

const publicRoutes = [
  "/pages/login",
  "/pages/register",
  "/",
  // NextAuth's own session/csrf/callback/signin/signout machinery. Gating it
  // behind "must already have a valid token" is circular: useSession() polls
  // /api/auth/session to find out *whether* there's a session, and signing
  // in at all requires hitting /api/auth/callback/* while unauthenticated.
  "/api/auth",
  // Account creation - there's no session yet by definition.
  "/api/register",
  // The VS Code extension authenticates with its own Bearer API-key JWT
  // (see lib/apiKeyAuth.ts), not a browser session cookie - it never has
  // one to send. Gating these behind getToken() would redirect every
  // extension request to the login page instead of reaching the route.
  "/api/extension",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ipKey = `ip:${getClientIp(req)}`;

  const generalLimit = await checkRateLimit(generalRateLimiter, ipKey);
  if (generalLimit) return generalLimit;

  if (pathname.startsWith("/api/register")) {
    const registerLimit = await checkRateLimit(registerRateLimiter, ipKey);
    if (registerLimit) return registerLimit;
  }

  if (pathname.startsWith("/api/extension")) {
    const apiKey = req.headers.get("Authorization") || ipKey;
    const extensionLimit = await checkRateLimit(extensionRateLimiter, apiKey);
    if (extensionLimit) return extensionLimit;
  }

  const isPublicRoute = publicRoutes.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/pages/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
