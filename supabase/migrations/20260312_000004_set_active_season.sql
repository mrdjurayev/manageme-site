-- Atomically set one active season for the authenticated user.

create or replace function public.set_active_season(p_season_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_exists boolean;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select exists (
    select 1
    from public.seasons s
    where s.id = p_season_id
      and s.user_id = current_user_id
  )
  into target_exists;

  if not target_exists then
    raise exception 'Season not found for current user';
  end if;

  update public.seasons
  set is_active = (id = p_season_id)
  where user_id = current_user_id;
end;
$$;

grant execute on function public.set_active_season(uuid) to authenticated;
