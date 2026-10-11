import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("portfolio_admin", process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
