import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NEXTAUTH_SECRET } from "./lib/config";

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

  // "/" must match exactly - startsWith("/") would make every path "public"
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
