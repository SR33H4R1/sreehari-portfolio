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

insert into public.portfolio_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
