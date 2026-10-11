import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/auth";
import { saveUploadedAsset } from "@/lib/uploadAsset";

export async function POST(request) {
  if (!isAuthorizedRequest(request)) return unauthorized();

  const form = await request.formData();
  const result = await saveUploadedAsset(form.get("file"));

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
