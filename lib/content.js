import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const contentPath = path.join(process.cwd(), "data", "portfolio.json");

export async function readContent() {
  const raw = await readFile(contentPath, "utf8");
  return JSON.parse(raw);
}

export async function writeContent(content) {
  await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
