create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'node_status_enum'
  ) then
    create type public.node_status_enum as enum ('online', 'degraded', 'offline', 'maintenance');
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'alert_severity_enum'
  ) then
    create type public.alert_severity_enum as enum ('critical', 'warning', 'info');
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'alert_status_enum'
  ) then
    create type public.alert_status_enum as enum ('open', 'resolved');
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'metric_type_enum'
  ) then
    create type public.metric_type_enum as enum (
      'latency_ms',
      'throughput_mbps',
      'packet_loss_pct',
      'jitter_ms'
    );
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'test_operator_enum'
  ) then
    create type public.test_operator_enum as enum ('lte', 'gte');
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'test_result_status_enum'
  ) then
    create type public.test_result_status_enum as enum ('pass', 'fail');
  end if;

  if not exists (
    select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'risk_level_enum'
  ) then
    create type public.risk_level_enum as enum ('low', 'medium', 'high', 'critical');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.network_nodes (
  id uuid primary key default gen_random_uuid(),
  site_code text not null unique,
  name text not null,
  region text not null,
  vendor text not null,
  node_type text not null,
  network_slice text not null,
  status public.node_status_enum not null default 'online',
  software_version text not null,
  availability_pct numeric(5, 2) not null check (availability_pct >= 0 and availability_pct <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.network_metrics (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.network_nodes(id) on delete cascade,
  metric_type public.metric_type_enum not null,
  metric_value numeric(10, 2) not null,
  unit text not null,
  threshold_value numeric(10, 2),
  sample_window text not null default '5m',
  recorded_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (node_id, metric_type, recorded_at)
);

create table if not exists public.network_alerts (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.network_nodes(id) on delete cascade,
  metric_id uuid not null references public.network_metrics(id) on delete cascade,
  network_slice text not null,
  severity public.alert_severity_enum not null,
  status public.alert_status_enum not null,
  metric_type public.metric_type_enum not null,
  title text not null,
  summary text not null,
  current_value numeric(10, 2) not null,
  threshold_value numeric(10, 2) not null,
  triggered_at timestamptz not null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  target_metric public.metric_type_enum not null,
  pass_threshold numeric(10, 2) not null,
  pass_condition public.test_operator_enum not null,
  estimated_duration_seconds integer not null check (estimated_duration_seconds > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  node_id uuid not null references public.network_nodes(id) on delete cascade,
  status public.test_result_status_enum not null,
  summary text not null,
  observed_value numeric(10, 2) not null,
  threshold_value numeric(10, 2) not null,
  details jsonb not null default '{}'::jsonb,
  executed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_reports (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.network_nodes(id) on delete cascade,
  network_slice text not null,
  risk_level public.risk_level_enum not null,
  title text not null,
  summary text not null,
  likely_causes text[] not null default '{}'::text[],
  recommendations text[] not null default '{}'::text[],
  source_alert_ids uuid[] not null default '{}'::uuid[],
  generated_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_network_nodes_network_slice
  on public.network_nodes (network_slice);

create index if not exists idx_network_nodes_status
  on public.network_nodes (status);

create index if not exists idx_network_metrics_node_id
  on public.network_metrics (node_id);

create index if not exists idx_network_metrics_metric_type
  on public.network_metrics (metric_type);

create index if not exists idx_network_metrics_recorded_at
  on public.network_metrics (recorded_at desc);

create index if not exists idx_network_alerts_node_id
  on public.network_alerts (node_id);

create index if not exists idx_network_alerts_status
  on public.network_alerts (status);

create index if not exists idx_network_alerts_severity
  on public.network_alerts (severity);

create index if not exists idx_network_alerts_metric_type
  on public.network_alerts (metric_type);

create index if not exists idx_network_alerts_triggered_at
  on public.network_alerts (triggered_at desc);

create index if not exists idx_test_cases_target_metric
  on public.test_cases (target_metric);

create index if not exists idx_test_results_test_case_id
  on public.test_results (test_case_id);

create index if not exists idx_test_results_node_id
  on public.test_results (node_id);

create index if not exists idx_test_results_status
  on public.test_results (status);

create index if not exists idx_test_results_executed_at
  on public.test_results (executed_at desc);

create index if not exists idx_analysis_reports_node_id
  on public.analysis_reports (node_id);

create index if not exists idx_analysis_reports_network_slice
  on public.analysis_reports (network_slice);

create index if not exists idx_analysis_reports_risk_level
  on public.analysis_reports (risk_level);

create index if not exists idx_analysis_reports_generated_at
  on public.analysis_reports (generated_at desc);

drop trigger if exists set_network_nodes_updated_at on public.network_nodes;
create trigger set_network_nodes_updated_at
before update on public.network_nodes
for each row execute function public.set_updated_at();

drop trigger if exists set_network_metrics_updated_at on public.network_metrics;
create trigger set_network_metrics_updated_at
before update on public.network_metrics
for each row execute function public.set_updated_at();

drop trigger if exists set_network_alerts_updated_at on public.network_alerts;
create trigger set_network_alerts_updated_at
before update on public.network_alerts
for each row execute function public.set_updated_at();

drop trigger if exists set_test_cases_updated_at on public.test_cases;
create trigger set_test_cases_updated_at
before update on public.test_cases
for each row execute function public.set_updated_at();

drop trigger if exists set_test_results_updated_at on public.test_results;
create trigger set_test_results_updated_at
before update on public.test_results
for each row execute function public.set_updated_at();

drop trigger if exists set_analysis_reports_updated_at on public.analysis_reports;
create trigger set_analysis_reports_updated_at
before update on public.analysis_reports
for each row execute function public.set_updated_at();

alter table public.network_nodes enable row level security;
alter table public.network_metrics enable row level security;
alter table public.network_alerts enable row level security;
alter table public.test_cases enable row level security;
alter table public.test_results enable row level security;
alter table public.analysis_reports enable row level security;

revoke all on public.network_nodes from anon;
revoke all on public.network_metrics from anon;
revoke all on public.network_alerts from anon;
revoke all on public.test_cases from anon;
revoke all on public.test_results from anon;
revoke all on public.analysis_reports from anon;

grant select, insert, update, delete on public.network_nodes to authenticated;
grant select, insert, update, delete on public.network_metrics to authenticated;
grant select, insert, update, delete on public.network_alerts to authenticated;
grant select, insert, update, delete on public.test_cases to authenticated;
grant select, insert, update, delete on public.test_results to authenticated;
grant select, insert, update, delete on public.analysis_reports to authenticated;

drop policy if exists "Authenticated users manage network_nodes" on public.network_nodes;
create policy "Authenticated users manage network_nodes"
  on public.network_nodes
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users manage network_metrics" on public.network_metrics;
create policy "Authenticated users manage network_metrics"
  on public.network_metrics
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users manage network_alerts" on public.network_alerts;
create policy "Authenticated users manage network_alerts"
  on public.network_alerts
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users manage test_cases" on public.test_cases;
create policy "Authenticated users manage test_cases"
  on public.test_cases
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users manage test_results" on public.test_results;
create policy "Authenticated users manage test_results"
  on public.test_results
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users manage analysis_reports" on public.analysis_reports;
create policy "Authenticated users manage analysis_reports"
  on public.analysis_reports
  for all
  to authenticated
  using (true)
  with check (true);
