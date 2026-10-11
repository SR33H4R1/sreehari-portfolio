import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/content";

export async function GET() {
  return NextResponse.json(await readContent());
}

export async function PUT(request) {
  const content = await request.json();
  await writeContent(content);
  return NextResponse.json({ ok: true });
}
