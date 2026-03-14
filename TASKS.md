
# TASKS.md

Step-by-step implementation plan for the NetPulse AI hackathon project.

## Phase 1 - Project Setup

1. Create Next.js project with App Router and TypeScript
2. Install dependencies:
   - Tailwind CSS
   - shadcn/ui
   - Supabase client/SSR
   - Zod
   - Sonner
3. Configure Tailwind and global design tokens
4. Initialize shadcn/ui
5. Setup feature-based folder structure
6. Establish Next.js Server Actions and Route Handlers for app-side backend flows

## Phase 2 - Data Model and Supabase Setup

1. Create Supabase project
2. Create database tables:
   - network_nodes
   - network_metrics
   - network_alerts
   - test_cases
   - test_results
   - analysis_reports
3. Add indexes for:
   - node_id
   - network_slice
   - status
   - severity
   - timestamp
   - executed_at
4. Enable Row Level Security
5. Add seed data for nodes, metrics, alerts, test cases, and test results

## Phase 3 - Authentication

1. Build `/signup` page
2. Build `/signin` page
3. Add protected layout for dashboard routes
4. Redirect authenticated users to `/dashboard`
5. Redirect unauthenticated users to `/signin`

Requirements:

- shadcn UI
- Next.js forms with Server Actions
- Zod validation
- Error messages below inputs

## Phase 4 - Landing Page

Route: `/`

Include:

- hero section
- product description
- feature highlights for monitoring, alerts, tests, and AI analysis
- sign in and sign up buttons

## Phase 5 - Dashboard

Route: `/dashboard`

Display:

- network health score
- metric cards for latency, throughput, packet loss, and jitter
- visual charts for alert severity mix and per-node metric distribution
- active alerts count
- latest test status
- recent AI or report summary
- recent alerts panel
- latest test results panel

Use shadcn Card components.

## Phase 6 - Nodes Page

Route: `/nodes`

Show table with:

- node name
- location
- vendor
- network slice
- status
- latency
- throughput
- packet loss
- jitter

Add filters for:

- vendor
- network slice
- status

## Phase 7 - Alerts Page

Route: `/alerts`

Display:

- alert title
- node
- metric
- severity
- status
- current value
- threshold value
- created time

Support:

- severity badges
- open and resolved tabs
- link back to node context

## Phase 8 - Test Runner

Route: `/tests`

Build:

- predefined test cases list
- node selector
- run test action
- latest run history table

Store:

- pass or fail status
- summary
- execution timestamp

## Phase 9 - AI Analysis Page

Route: `/analysis`

Feature:

- `Analyze Network` button

Input context:

- latest metrics
- active alerts
- recent test results

Output:

- detected issues
- severity or risk
- likely causes
- recommendations

Display results in cards.

## Phase 10 - Reports Page

Route: `/reports`

Display:

- health summary
- open alerts summary
- latest test outcomes
- latest AI analysis summary
- operational recommendations

Keep report output copy-friendly for demos and judge review.

## Phase 11 - Error Handling

Use toast notifications for:

- API failures
- Supabase errors
- test execution failures
- analysis failures
- unexpected exceptions

## Phase 12 - Seed Data and Domain Rules

1. Seed demo nodes across multiple cities
2. Assign vendors and network slices
3. Seed threshold-based alerts
4. Seed predefined test cases
5. Ensure analysis output maps back to seeded metrics and alerts

## Phase 13 - Deployment

1. Push repository to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Verify:

- Auth works
- Dashboard loads
- Nodes filters work
- Alerts load
- Tests run
- Analysis works
- Reports render

## Phase 14 - Demo Preparation

Prepare a 5-minute demo:

1. Problem introduction
2. Login
3. Dashboard overview
4. Alerts review
5. Test runner
6. AI analysis
7. Report summary
8. Closing CTA
