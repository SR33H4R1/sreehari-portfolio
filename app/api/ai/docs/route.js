import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const docs = await readFile(path.join(process.cwd(), "docs", "ai-api.md"), "utf8");
  return new NextResponse(docs, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
