-- Run in Supabase Dashboard → SQL Editor if Hotel Management shows errors.

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  rating numeric default 0,
  rooms integer default 0,
  available integer default 0,
  status text default 'active',
  revenue text default '$0',
  created_at timestamptz default now()
);

alter table public.hotels enable row level security;
