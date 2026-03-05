import { type NextRequest, NextResponse } from "next/server";

import { applySecurityHeaders } from "@/lib/security/headers";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = new Set(["/login"]);
const PUBLIC_ROUTES = new Set(["/api/system/stack-status"]);

function isSafeRedirectPath(pathname: string): boolean {
  return pathname.startsWith("/") && !pathname.startsWith("//");
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { response, user } = await updateSession(request);

  if (PUBLIC_ROUTES.has(pathname)) {
    return applySecurityHeaders(response);
  }

  if (!user && !AUTH_ROUTES.has(pathname)) {
    const loginUrl = new URL("/login", request.url);
    const requestedPath = `${pathname}${search}`;

    if (isSafeRedirectPath(requestedPath)) {
      loginUrl.searchParams.set("redirectTo", requestedPath);
    }

    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (user && AUTH_ROUTES.has(pathname)) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)",
  ],
};
