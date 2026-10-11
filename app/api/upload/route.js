import { NextResponse } from "next/server";
import { saveUploadedAsset } from "@/lib/uploadAsset";

export async function POST(request) {
  const form = await request.formData();
  const result = await saveUploadedAsset(form.get("file"));

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
