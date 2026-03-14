# AGENTS.md

Living instruction file for Codex CLI agents in this repository. Agents must read this file before making any code changes.

## Project

NetPulse AI - 5G Network Monitoring, Alerting, and Test Automation SaaS

## Product Scope (Hackathon)

Build a credible telecom demo with:

- authentication
- monitoring dashboard
- nodes view
- alert center
- predefined test runner
- AI analysis
- simple reports

Do not expand into the full enterprise blueprint during the hackathon build.

## Explicit Non-Goals

- live vendor equipment integrations
- mobile companion app
- RF and spectrum visualizations
- full 3GPP conformance testing
- digital twin simulation
- self-healing orchestration

## Tech Stack (Mandatory)

- Next.js (App Router, Server Components, Server Actions, Route Handlers)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- Supabase (Auth + Postgres)
- Zod
- Sonner Toast
- Deployment: Vercel
- Package Manager: pnpm

Agents must use Next.js for both frontend and backend work in this repository. Do not introduce a separate frontend framework, a standalone backend service, or React-specific helper libraries beyond what Next.js requires internally.

## Architecture

Feature-based modular architecture.

### Routes

- `/`
- `/signin`
- `/signup`
- `/dashboard`
- `/nodes`
- `/alerts`
- `/tests`
- `/analysis`
- `/reports`

### Suggested structure

- `app/(auth)/signin`
- `app/(auth)/signup`
- `app/(dashboard)/dashboard`
- `app/(dashboard)/nodes`
- `app/(dashboard)/alerts`
- `app/(dashboard)/tests`
- `app/(dashboard)/analysis`
- `app/(dashboard)/reports`
- `components/ui`
- `components/auth`
- `components/dashboard`
- `components/nodes`
- `components/alerts`
- `components/tests`
- `components/reports`
- `lib/supabase`
- `lib/validations`
- `lib/utils`
- `lib/analysis`
- `lib/data`
- `hooks`
- `types`
- `supabase`
- `doc`

## Data Model Expectations

Tables:

- `network_nodes`
- `network_metrics`
- `network_alerts`
- `test_cases`
- `test_results`
- `analysis_reports`

Core domain fields:

- `network_nodes`: vendor, network_slice, status
- `network_alerts`: severity, status, metric_type, current_value, threshold_value
- `test_results`: test_case_id, node_id, status, executed_at
- `analysis_reports`: risk_level, likely_causes, recommendations

All tables must include:

- UUID primary key
- timestamps
- proper indexing

Enable Row Level Security.

## Development Principles

### Performance First

- Prefer server components
- Prefer Server Actions and Route Handlers for mutations and backend logic
- Avoid unnecessary client-side rendering
- Use dynamic imports only when needed

### Type Safety

- TypeScript strict mode
- No `any`
- Use Zod schemas at form and server boundaries

### Clean Code

- Target max file size of about 200 lines where reasonable
- Small reusable components
- Descriptive naming

### Telecom Realism

- Use deterministic seeded data
- Alerts and test outcomes must be explainable from actual metrics
- AI summaries must reference concrete nodes, metrics, alerts, or slices
- Prefer believable vendor and network slice labels over generic placeholders

## Form Handling

Forms must use:

- Next.js forms with Server Actions or Route Handlers
- Zod validation
- shadcn input primitives

Do not rely on HTML default validation.

Validation messages must appear directly below inputs in red text.

## Error Handling

Validation errors:

- Display under the input field

System exceptions:

- Use Sonner toast

Example: `toast.error("Something went wrong")`

Never expose raw errors or stack traces.

## UI Standards

Use only shadcn components:

- Card
- Button
- Input
- Label
- Table
- Badge
- Tabs
- Dialog
- Skeleton
- Progress

UI must be:

- mobile first
- responsive
- accessible
- dashboard-oriented, not marketing-only

## Dashboard Requirements

Dashboard must surface:

- four core metrics
- network health score
- active alert count
- latest test result
- recent AI summary

## Alerts Rules

- Severity values: `critical`, `warning`, `info`
- Status values: `open`, `resolved`
- Every alert must map to a node and a metric

## Test Runner Rules

- Use predefined test cases only
- Test execution can be simulated, but it must persist a result
- Each result needs pass or fail status, summary, and execution timestamp

## Reporting Rules

- Reports are lightweight operational summaries, not full PDF exports
- Reports should combine metrics, alerts, tests, and AI findings in one screen

## Authentication Flow

Routes:

- `/signup`
- `/signin`
- `/dashboard`
- all dashboard child routes

Rules:

- Dashboard area must be protected
- Redirect unauthenticated users to signin

## Security Rules

- Validate all inputs
- Never expose secrets
- Use environment variables
- Keep AI keys server-side only

Required env variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional server-only env variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

## Deployment

Deployment platform: Vercel

Agents must ensure build passes:

`pnpm build`

## Commit Convention

Use Conventional Commits:

- `feat(auth): add signup form`
- `feat(alerts): add severity-based alert feed`
- `feat(tests): add predefined test runner`
- `feat(reports): add ops summary page`
- `fix(auth): handle login error`

## Final Principle

The system must feel like a believable telecom SaaS product with clear monitoring, alerting, testing, and reporting flows, not a generic CRUD prototype.
