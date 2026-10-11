import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";

const protectedPaths = ["/admin", "/api/content", "/api/upload", "/api/ai"];

export function proxy(request) {
  if (!process.env.ADMIN_PASSWORD) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/api/content" && request.method === "GET") {
    return NextResponse.next();
  }
  if (pathname === "/api/ai/docs" && request.method === "GET") {
    return NextResponse.next();
  }

  const needsAuth = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!needsAuth) return NextResponse.next();

  if (isAuthorizedRequest(request)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*", "/api/upload/:path*", "/api/ai/:path*"],
};
