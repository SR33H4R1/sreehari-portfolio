import { NextResponse } from "next/server";

export function isAuthorizedRequest(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true;

  const cookie = request.cookies?.get("portfolio_admin")?.value;
  if (cookie === password) return true;

  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer === password) return true;

  const apiKey = request.headers.get("x-api-key") || request.headers.get("x-admin-password");
  return apiKey === password;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
