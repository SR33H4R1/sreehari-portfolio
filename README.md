# Sreehari Portfolio

Next.js portfolio site with an embedded visual editor based on the original portfolio design.

## Local development

```bash
npm install
npm run dev
```

Open:

- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin

Set `ADMIN_PASSWORD` in production to protect the admin route and upload APIs.

## Supabase Postgres persistence

The app uses Supabase Postgres when these production environment variables are set:

```bash
DATABASE_URL=...
DIRECT_URL=...
SUPABASE_CONTENT_ID=main
ADMIN_PASSWORD=...
```

Run [supabase/schema.sql](./supabase/schema.sql) in the Supabase SQL editor. The app stores admin content in `portfolio_content` and uploaded images/resumes in `portfolio_assets`.

Without `DATABASE_URL`, local development falls back to [data/portfolio.json](./data/portfolio.json) and local uploads under `public/uploads`.
