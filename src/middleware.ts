import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "accesstoken";

const AUTH_ROUTE_PREFIX = "/auth";
const PROTECTED_ROUTE_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  console.log("token, ", token);
  const isAuthRoute = pathname.startsWith(AUTH_ROUTE_PREFIX);
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTE_PREFIX);

  if (isProtectedRoute && !token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const redirectTo = request.nextUrl.searchParams.get("from") || "/dashboard";
    const safeRedirect = redirectTo.startsWith("/auth")
      ? "/dashboard"
      : redirectTo;
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = safeRedirect;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
