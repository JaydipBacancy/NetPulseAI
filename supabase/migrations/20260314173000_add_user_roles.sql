do $$
begin
  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'app_role_enum'
  ) then
    create type public.app_role_enum as enum ('admin', 'operator', 'viewer');
  end if;
end
$$;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_role_enum not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_role
  on public.user_profiles (role);

create index if not exists idx_user_profiles_is_active
  on public.user_profiles (is_active);

create or replace function public.current_user_role()
returns public.app_role_enum
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_profiles
  where id = auth.uid();
$$;

create or replace function public.current_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select is_active
      from public.user_profiles
      where id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.current_user_can_manage_operations()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_is_active()
    and coalesce(public.current_user_role() in ('admin', 'operator'), false);
$$;

create or replace function public.assign_default_app_role()
returns public.app_role_enum
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.user_profiles
    where role = 'admin'
      and is_active = true
  ) then
    return 'viewer';
  end if;

  return 'admin';
end;
$$;

create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_email text;
  resolved_full_name text;
begin
  resolved_email := coalesce(
    nullif(trim(new.email), ''),
    concat(new.id::text, '@placeholder.local')
  );
  resolved_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(trim(split_part(resolved_email, '@', 1)), ''),
    'Network User'
  );

  insert into public.user_profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
  )
  values (
    new.id,
    resolved_email,
    resolved_full_name,
    public.assign_default_app_role(),
    true,
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();

  return new;
end;
$$;

insert into public.user_profiles (
  id,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
)
select
  ordered_users.id,
  ordered_users.resolved_email,
  ordered_users.resolved_full_name,
  case
    when ordered_users.user_order = 1 then 'admin'::public.app_role_enum
    else 'viewer'::public.app_role_enum
  end,
  true,
  coalesce(ordered_users.created_at, now()),
  now()
from (
  select
    users.id,
    users.created_at,
    coalesce(
      nullif(trim(users.email), ''),
      concat(users.id::text, '@placeholder.local')
    ) as resolved_email,
    coalesce(
      nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(users.raw_user_meta_data ->> 'name'), ''),
      nullif(
        trim(
          split_part(
            coalesce(
              nullif(trim(users.email), ''),
              concat(users.id::text, '@placeholder.local')
            ),
            '@',
            1
          )
        ),
        ''
      ),
      'Network User'
    ) as resolved_full_name,
    row_number() over (order by users.created_at asc nulls first, users.id asc) as user_order
  from auth.users as users
) as ordered_users
on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = now();

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_auth_user_profile();

alter table public.user_profiles enable row level security;

revoke all on public.user_profiles from anon;
revoke all on public.user_profiles from authenticated;

grant select, update on public.user_profiles to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_is_active() to authenticated;
grant execute on function public.current_user_is_admin() to authenticated;
grant execute on function public.current_user_can_manage_operations() to authenticated;

drop policy if exists "Users view own profile or admins view all profiles" on public.user_profiles;
create policy "Users view own profile or admins view all profiles"
  on public.user_profiles
  for select
  to authenticated
  using (
    auth.uid() = id
    or public.current_user_is_admin()
  );

drop policy if exists "Admins update user profiles" on public.user_profiles;
create policy "Admins update user profiles"
  on public.user_profiles
  for update
  to authenticated
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

drop policy if exists "Authenticated users manage network_nodes" on public.network_nodes;
drop policy if exists "Authenticated users manage network_metrics" on public.network_metrics;
drop policy if exists "Authenticated users manage network_alerts" on public.network_alerts;
drop policy if exists "Authenticated users manage test_cases" on public.test_cases;
drop policy if exists "Authenticated users manage test_results" on public.test_results;
drop policy if exists "Authenticated users manage analysis_reports" on public.analysis_reports;

drop policy if exists "Active users view network_nodes" on public.network_nodes;
drop policy if exists "Operators manage network_nodes" on public.network_nodes;
drop policy if exists "Active users view network_metrics" on public.network_metrics;
drop policy if exists "Operators manage network_metrics" on public.network_metrics;
drop policy if exists "Active users view network_alerts" on public.network_alerts;
drop policy if exists "Operators manage network_alerts" on public.network_alerts;
drop policy if exists "Active users view test_cases" on public.test_cases;
drop policy if exists "Operators manage test_cases" on public.test_cases;
drop policy if exists "Active users view test_results" on public.test_results;
drop policy if exists "Operators manage test_results" on public.test_results;
drop policy if exists "Active users view analysis_reports" on public.analysis_reports;
drop policy if exists "Operators manage analysis_reports" on public.analysis_reports;

create policy "Active users view network_nodes"
  on public.network_nodes
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage network_nodes"
  on public.network_nodes
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());

create policy "Active users view network_metrics"
  on public.network_metrics
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage network_metrics"
  on public.network_metrics
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());

create policy "Active users view network_alerts"
  on public.network_alerts
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage network_alerts"
  on public.network_alerts
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());

create policy "Active users view test_cases"
  on public.test_cases
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage test_cases"
  on public.test_cases
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());

create policy "Active users view test_results"
  on public.test_results
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage test_results"
  on public.test_results
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());

create policy "Active users view analysis_reports"
  on public.analysis_reports
  for select
  to authenticated
  using (public.current_user_is_active());

create policy "Operators manage analysis_reports"
  on public.analysis_reports
  for all
  to authenticated
  using (public.current_user_can_manage_operations())
  with check (public.current_user_can_manage_operations());
