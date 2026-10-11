import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { ensurePortfolioSchema } from "@/lib/postgres";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"]);

export async function saveUploadedAsset(file) {
  if (!file || typeof file === "string") {
    return { error: "No file uploaded", status: 400 };
  }

  if (!allowed.has(file.type)) {
    return { error: "Unsupported file type", status: 400 };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const folder = file.type === "application/pdf" ? "resumes" : "projects";
  const filename = `${folder}/${Date.now()}-${safeName}`;

  const db = await ensurePortfolioSchema();
  if (db) {
    const id = randomUUID();
    await db.query(
      `
        insert into public.portfolio_assets (id, filename, mime_type, bytes)
        values ($1, $2, $3, $4)
      `,
      [id, filename, file.type, bytes]
    );
    return { url: `/api/assets/${id}/${encodeURIComponent(safeName)}`, path: filename };
  }

  const publicDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(publicDir, { recursive: true });
  await mkdir(path.join(publicDir, folder), { recursive: true });
  await writeFile(path.join(publicDir, filename), bytes);

  return { url: `/uploads/${filename}`, path: filename };
}
