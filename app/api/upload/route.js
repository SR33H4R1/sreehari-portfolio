import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"]);

export async function POST(request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const filename = `${Date.now()}-${safeName}`;
  const publicDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
