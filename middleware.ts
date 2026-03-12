import { type NextRequest, NextResponse } from "next/server";

import { applySecurityHeaders } from "@/lib/security/headers";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = new Set(["/login"]);
const PUBLIC_ROUTES = new Set(["/api/system/stack-status"]);

function isSafeRedirectPath(pathname: string): boolean {
  return pathname.startsWith("/") && !pathname.startsWith("//");
}

async function updateSessionWithRetry(request: NextRequest, attempts: number = 2) {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await updateSession(request);
    } catch (error) {
      lastError = error;

      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    }
  }

  throw lastError;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (PUBLIC_ROUTES.has(pathname)) {
    const response = NextResponse.next({ request });
    return applySecurityHeaders(response);
  }

  if (isAuthRoute && request.method !== "GET") {
    const response = NextResponse.next({ request });
    return applySecurityHeaders(response);
  }

  let sessionResult: Awaited<ReturnType<typeof updateSession>>;

  try {
    sessionResult = await updateSessionWithRetry(request, 2);
  } catch (error) {
    // Prevents hard 500 from middleware when runtime configuration is temporarily invalid.
    console.error("Middleware session update failed", error);

    if (isAuthRoute) {
      const response = NextResponse.next({ request });
      return applySecurityHeaders(response);
    }

    const loginUrl = new URL("/login", request.url);
    const requestedPath = `${pathname}${search}`;

    if (isSafeRedirectPath(requestedPath)) {
      loginUrl.searchParams.set("redirectTo", requestedPath);
    }

    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  const { response, user } = sessionResult;

  if (!user && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    const requestedPath = `${pathname}${search}`;

    if (isSafeRedirectPath(requestedPath)) {
      loginUrl.searchParams.set("redirectTo", requestedPath);
    }

    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)",
  ],
};
