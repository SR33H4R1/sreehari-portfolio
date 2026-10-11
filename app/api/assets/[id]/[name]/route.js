import { NextResponse } from "next/server";
import { ensurePortfolioSchema } from "@/lib/postgres";

export async function GET(_request, { params }) {
  const { id } = await params;
  const db = await ensurePortfolioSchema();

  if (!db) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 404 });
  }

  const result = await db.query(
    "select filename, mime_type, bytes from public.portfolio_assets where id = $1",
    [id]
  );
  const asset = result.rows[0];

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  return new Response(asset.bytes, {
    headers: {
      "Content-Type": asset.mime_type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${asset.filename.split("/").pop()}"`,
    },
  });
}
