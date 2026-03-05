-- Seasons and subjects owned by authenticated user.

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  code text not null check (char_length(code) between 2 and 24),
  start_date date,
  end_date date,
  is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint seasons_date_order check (
    start_date is null
    or end_date is null
    or start_date <= end_date
  )
);

create unique index if not exists seasons_user_code_unique
on public.seasons(user_id, lower(code));

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  code text not null check (char_length(code) between 2 and 24),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists subjects_user_season_code_unique
on public.subjects(user_id, season_id, lower(code));

drop trigger if exists set_seasons_updated_at on public.seasons;
create trigger set_seasons_updated_at
before update on public.seasons
for each row
execute function public.set_updated_at();

drop trigger if exists set_subjects_updated_at on public.subjects;
create trigger set_subjects_updated_at
before update on public.subjects
for each row
execute function public.set_updated_at();

alter table public.seasons enable row level security;
alter table public.seasons force row level security;
alter table public.subjects enable row level security;
alter table public.subjects force row level security;

drop policy if exists "seasons_select_own" on public.seasons;
create policy "seasons_select_own"
on public.seasons
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "seasons_insert_own" on public.seasons;
create policy "seasons_insert_own"
on public.seasons
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "seasons_update_own" on public.seasons;
create policy "seasons_update_own"
on public.seasons
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "seasons_delete_own" on public.seasons;
create policy "seasons_delete_own"
on public.seasons
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "subjects_select_own" on public.subjects;
create policy "subjects_select_own"
on public.subjects
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "subjects_insert_own" on public.subjects;
create policy "subjects_insert_own"
on public.subjects
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.seasons s
    where s.id = season_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "subjects_update_own" on public.subjects;
create policy "subjects_update_own"
on public.subjects
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.seasons s
    where s.id = season_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "subjects_delete_own" on public.subjects;
create policy "subjects_delete_own"
on public.subjects
for delete
to authenticated
using (auth.uid() = user_id);
