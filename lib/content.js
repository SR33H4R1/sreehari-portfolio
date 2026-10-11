import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contentId, ensurePortfolioSchema } from "@/lib/postgres";

export const contentPath = path.join(process.cwd(), "data", "portfolio.json");

async function readDefaultContent() {
  const raw = await readFile(contentPath, "utf8");
  return JSON.parse(raw);
}

export async function readContent() {
  const fallback = await readDefaultContent();
  const db = await ensurePortfolioSchema();
  if (!db) return fallback;

  try {
    const result = await db.query("select content from public.portfolio_content where id = $1", [contentId]);
    const content = result.rows[0]?.content;
    if (!content || (typeof content === "object" && Object.keys(content).length === 0)) return fallback;
    return content;
  } catch (error) {
    console.error("Postgres content read failed:", error.message);
    return fallback;
  }
}

export async function writeContent(content) {
  const db = await ensurePortfolioSchema();
  if (db) {
    await db.query(
      `
        insert into public.portfolio_content (id, content, updated_at)
        values ($1, $2::jsonb, now())
        on conflict (id)
        do update set content = excluded.content, updated_at = now()
      `,
      [contentId, JSON.stringify(content)]
    );
    return;
  }

  await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
