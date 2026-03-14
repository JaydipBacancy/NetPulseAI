# Phase 2 Supabase Setup

This repository is now ready for the database portion of Phase 2. The remaining hosted step is creating a Supabase project and applying the SQL in this repo.

## Files

- `supabase/migrations/20260314120000_phase2_supabase_core.sql`
- `supabase/seed.sql`
- `types/supabase.ts`

## What the migration creates

- Enum-backed domain values for node status, alert severity, alert status, metric type, test operators, test result status, and report risk level.
- Tables for `network_nodes`, `network_metrics`, `network_alerts`, `test_cases`, `test_results`, and `analysis_reports`.
- UUID primary keys, `created_at` and `updated_at` timestamps, update triggers, and the required indexes.
- RLS enabled on every table.
- Authenticated-user access policies for the hackathon phase.

## Apply to a new Supabase project

1. Create a new Supabase project for NetPulse AI.
2. Open the SQL editor and run `supabase/migrations/20260314120000_phase2_supabase_core.sql`.
3. Run `supabase/seed.sql`.
4. Copy the project URL and anon key into `.env.local` using the keys shown in `.env.example`.

## RLS note

The current policies allow any authenticated user to read and write the Phase 2 tables. That is intentional for the hackathon baseline so Phase 3 auth work can proceed without fighting schema churn. If we want tenant or per-user ownership later, tighten the policies during or immediately after Phase 3.

## Seed data shape

The seeded rows are deterministic and telecom-specific:

- six realistic 5G nodes across enterprise, telemedicine, logistics, consumer, smart-grid, and industrial slices
- metric rows that explain every seeded alert
- predefined test cases with matching test results
- analysis reports that cite concrete nodes, metrics, alerts, and slices

## Validation target

After applying the SQL and setting `.env.local`, Phase 3 can start directly on top of:

- typed Supabase clients in `lib/supabase`
- strict database types in `types/supabase.ts`
- deterministic baseline operational data for dashboard, alerts, tests, and reports
