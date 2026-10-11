import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/api/content", "/api/upload"];

export function proxy(request) {
  if (!process.env.ADMIN_PASSWORD) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/api/content" && request.method === "GET") {
    return NextResponse.next();
  }

  const needsAuth = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get("portfolio_admin")?.value;
  if (token === process.env.ADMIN_PASSWORD) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*", "/api/upload/:path*"],
};
