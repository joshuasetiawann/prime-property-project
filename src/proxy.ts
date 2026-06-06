import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "pp_session";

/**
 * Edge gate for the internal portal. Presence of the session cookie is the
 * first hurdle; server components then fully validate the session and enforce
 * role-based access (the real authorization gate lives in the API + pages).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bare /agent → dashboard.
  if (pathname === "/agent") {
    return NextResponse.redirect(new URL("/agent/dashboard", req.url));
  }

  const isLogin = pathname === "/agent/login";
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (!isLogin && !hasSession) {
    const url = new URL("/agent/login", req.url);
    if (pathname !== "/agent/dashboard") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*"],
};
