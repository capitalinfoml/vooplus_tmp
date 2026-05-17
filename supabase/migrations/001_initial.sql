-- DroneFee — initial schema
-- Run via: supabase db push

create extension if not exists "pgcrypto";

-- Users (extends Supabase auth.users)
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  plan          text not null default 'free' check (plan in ('free', 'pro')),
  business_name text,
  logo_url      text,
  country_code  text,
  currency      text not null default 'USD',
  tagline       text,
  created_at    timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "Users can read own row"    on public.users for select using (auth.uid() = id);
create policy "Users can update own row"  on public.users for update using (auth.uid() = id);
create policy "Users can insert own row"  on public.users for insert with check (auth.uid() = id);

-- Rate cards
create table public.rate_cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  service_type text not null,
  base_price   integer not null, -- USD cents
  currency     text not null default 'USD',
  unit         text not null check (unit in ('per_hour','per_day','per_deliverable')),
  is_public    boolean not null default false,
  share_slug   text unique,
  created_at   timestamptz not null default now()
);

alter table public.rate_cards enable row level security;
create policy "Users manage own rate cards" on public.rate_cards for all using (auth.uid() = user_id);
create policy "Public rate cards readable"  on public.rate_cards for select using (is_public = true);

-- Proposals
create table public.proposals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  client_name     text not null,
  client_email    text,
  project_type    text not null,
  line_items      jsonb not null default '[]'::jsonb,
  subtotal        integer not null default 0, -- USD cents
  currency        text not null default 'USD',
  status          text not null default 'draft' check (status in ('draft','sent','accepted','declined')),
  pdf_url         text,
  created_at      timestamptz not null default now()
);

alter table public.proposals enable row level security;
create policy "Users manage own proposals" on public.proposals for all using (auth.uid() = user_id);

-- Community rates
create table public.community_rates (
  id               uuid primary key default gen_random_uuid(),
  country_code     text not null,
  city             text,
  service_type     text not null,
  reported_price   integer not null, -- USD cents
  currency         text not null default 'USD',
  experience_years integer,
  verified         boolean not null default false,
  created_at       timestamptz not null default now()
);

-- Community rates are publicly readable, anyone can insert (IP rate-limited at API layer)
alter table public.community_rates enable row level security;
create policy "Community rates public read"   on public.community_rates for select using (true);
create policy "Anyone can report rates"       on public.community_rates for insert with check (true);

-- Aggregated benchmark materialized view (refreshed every 6hr via pg_cron or edge function)
create materialized view public.rate_benchmarks as
select
  country_code,
  service_type,
  count(*)                                               as sample_size,
  percentile_cont(0.25) within group (order by reported_price) as p25,
  percentile_cont(0.5)  within group (order by reported_price) as median,
  percentile_cont(0.75) within group (order by reported_price) as p75,
  min(reported_price)                                   as min_price,
  max(reported_price)                                   as max_price
from public.community_rates
group by country_code, service_type;

create unique index on public.rate_benchmarks (country_code, service_type);

-- Trigger: create user profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
