-- Schedule lessons and attendance records owned by authenticated user.

create table if not exists public.schedule_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 140),
  weekday smallint not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  location text check (location is null or char_length(location) <= 120),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint schedule_time_order check (start_time < end_time)
);

create unique index if not exists schedule_lessons_user_slot_unique
on public.schedule_lessons(user_id, weekday, start_time, end_time, subject_id);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.schedule_lessons(id) on delete cascade,
  lesson_date date not null,
  status text not null check (status in ('present', 'absent', 'late')),
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists attendance_records_user_unique
on public.attendance_records(user_id, lesson_id, lesson_date);

drop trigger if exists set_schedule_lessons_updated_at on public.schedule_lessons;
create trigger set_schedule_lessons_updated_at
before update on public.schedule_lessons
for each row
execute function public.set_updated_at();

drop trigger if exists set_attendance_records_updated_at on public.attendance_records;
create trigger set_attendance_records_updated_at
before update on public.attendance_records
for each row
execute function public.set_updated_at();

alter table public.schedule_lessons enable row level security;
alter table public.schedule_lessons force row level security;
alter table public.attendance_records enable row level security;
alter table public.attendance_records force row level security;

drop policy if exists "schedule_lessons_select_own" on public.schedule_lessons;
create policy "schedule_lessons_select_own"
on public.schedule_lessons
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "schedule_lessons_insert_own" on public.schedule_lessons;
create policy "schedule_lessons_insert_own"
on public.schedule_lessons
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
  and exists (
    select 1
    from public.subjects sub
    where sub.id = subject_id
      and sub.user_id = auth.uid()
      and sub.season_id = season_id
  )
);

drop policy if exists "schedule_lessons_update_own" on public.schedule_lessons;
create policy "schedule_lessons_update_own"
on public.schedule_lessons
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
  and exists (
    select 1
    from public.subjects sub
    where sub.id = subject_id
      and sub.user_id = auth.uid()
      and sub.season_id = season_id
  )
);

drop policy if exists "schedule_lessons_delete_own" on public.schedule_lessons;
create policy "schedule_lessons_delete_own"
on public.schedule_lessons
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "attendance_records_select_own" on public.attendance_records;
create policy "attendance_records_select_own"
on public.attendance_records
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "attendance_records_insert_own" on public.attendance_records;
create policy "attendance_records_insert_own"
on public.attendance_records
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.schedule_lessons l
    where l.id = lesson_id
      and l.user_id = auth.uid()
  )
);

drop policy if exists "attendance_records_update_own" on public.attendance_records;
create policy "attendance_records_update_own"
on public.attendance_records
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.schedule_lessons l
    where l.id = lesson_id
      and l.user_id = auth.uid()
  )
);

drop policy if exists "attendance_records_delete_own" on public.attendance_records;
create policy "attendance_records_delete_own"
on public.attendance_records
for delete
to authenticated
using (auth.uid() = user_id);
