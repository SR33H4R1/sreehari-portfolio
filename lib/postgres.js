import pg from "pg";

const { Pool } = pg;

let pool;
let schemaReady;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!hasDatabase()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

export async function ensurePortfolioSchema() {
  const db = getPool();
  if (!db) return null;
  if (!schemaReady) {
    schemaReady = db.query(`
      create table if not exists public.portfolio_content (
        id text primary key,
        content jsonb not null,
        updated_at timestamptz not null default now()
      );

      create table if not exists public.portfolio_assets (
        id uuid primary key,
        filename text not null,
        mime_type text not null,
        bytes bytea not null,
        created_at timestamptz not null default now()
      );
    `);
  }
  await schemaReady;
  return db;
}

export const contentId = process.env.SUPABASE_CONTENT_ID || "main";
