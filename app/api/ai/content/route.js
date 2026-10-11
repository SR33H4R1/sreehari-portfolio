import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/auth";
import { applyAiPatch } from "@/lib/aiContent";
import { readContent, writeContent } from "@/lib/content";

export async function GET(request) {
  if (!isAuthorizedRequest(request)) return unauthorized();
  return NextResponse.json(await readContent());
}

export async function PUT(request) {
  if (!isAuthorizedRequest(request)) return unauthorized();

  const content = await request.json();
  await writeContent(content);
  return NextResponse.json({ ok: true, mode: "replace" });
}

export async function PATCH(request) {
  if (!isAuthorizedRequest(request)) return unauthorized();

  try {
    const patch = await request.json();
    const current = await readContent();
    const { content, summary } = applyAiPatch(current, patch);
    await writeContent(content);
    return NextResponse.json({ ok: true, mode: "patch", summary, content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
