# NetPulse AI - Product Requirements Document (PRD)

## 1. Product Name

**NetPulse AI**

**Tagline:** AI-powered 5G network monitoring, testing, and anomaly detection platform

---

## 2. Product Overview

NetPulse AI is a cloud-based monitoring and testing platform designed to help telecom engineers visualize 5G network health, run lightweight validation checks, and review AI-generated operational insights.

The hackathon version simulates core network metrics such as:

- latency
- throughput
- packet loss
- jitter

It also introduces a small but credible telecom workflow around:

- threshold-based alerts
- predefined test execution
- simple operational reports
- vendor and network slice context

The goal is to demonstrate a cloud-first, software-led alternative to traditional telecom testing platforms.

---

## 3. Problem Statement

Modern 5G networks are complex and distributed, making it difficult to:

- monitor performance across locations
- detect network degradation quickly
- validate network behavior with repeatable tests
- summarize incidents and performance trends for operators and vendors

Traditional testing platforms are often hardware-heavy, expensive, and difficult to visualize.

NetPulse AI provides a simpler cloud dashboard with AI-powered insights, alerting, and test visibility.

---

## 4. Target Users

### Network Engineers

Monitor real-time network performance and investigate failures.

### Telecom Operators

Track network health, alerts, and service degradation across regions.

### Equipment Vendors

Validate network behavior during rollout and testing phases.

### Field Test Teams

Run quick validation checks before demos, handovers, or incident reviews.

---

## 5. MVP Scope (Hackathon Version)

### 1. Authentication

- Sign up
- Sign in
- Logout
- Protected dashboard routes

### 2. Network Metrics Dashboard

Display simulated network metrics and summary signals:

- Latency (ms)
- Throughput (Mbps)
- Packet Loss (%)
- Jitter (ms)
- Network Health Score
- Active Alerts Count
- Latest Test Status

### 3. Network Nodes List

Example nodes:

- Ahmedabad 5G Tower
- Mumbai Core Node
- Delhi Edge Node
- Bangalore Data Center

Each node shows:

- status
- vendor
- network slice
- latency
- throughput
- packet loss
- jitter

### 4. Alert Center

Display simulated threshold-based alerts for metric breaches.

Each alert shows:

- node
- metric
- severity
- status
- current value
- threshold value
- created time

### 5. Test Runner

Allow the user to run predefined validation tests against a selected node.

Initial test cases:

- Latency Baseline Check
- Throughput Validation
- Packet Loss Sweep

Each run stores:

- pass or fail status
- summary
- execution time

### 6. AI Network Analysis

User clicks **Analyze Network**.

AI analyzes:

- latest network metrics
- active alerts
- recent test results

AI generates:

- detected anomalies
- risk level
- likely causes
- optimization recommendations

Example output:

> High latency detected in Ahmedabad on the eMBB slice. The latest latency baseline test failed, which suggests congestion or backhaul contention.

### 7. Simple Reports

Generate a lightweight operational summary for demo purposes.

Each report includes:

- health score
- open alerts
- latest test outcomes
- AI summary
- recommended next actions

---

## 6. Hackathon Boundaries

To keep the build realistic for today, the hackathon MVP will not include:

- live vendor equipment integrations
- mobile companion app
- full RF or spectrum analysis
- 3GPP conformance engine
- digital twin simulation
- autonomous self-healing workflows

---

## 7. User Flow

### Authentication Flow

1. User visits landing page
2. User signs up or signs in
3. User is redirected to the dashboard

### Monitoring Flow

1. User opens the dashboard
2. Network metrics, health score, and latest operational summaries appear
3. User reviews nodes, alerts, and latest tests

### Alert Review Flow

1. User opens the alerts page
2. Open alerts are grouped by severity
3. User inspects the affected node and metric

### Test Execution Flow

1. User opens the test runner
2. User selects a node and predefined test
3. System stores a simulated result and shows pass or fail status

### AI Analysis Flow

1. User clicks Analyze Network
2. AI processes metrics, active alerts, and recent tests
3. AI generates insights and recommendations

### Reporting Flow

1. User opens the reports page
2. System combines health score, alerts, tests, and analysis
3. User reviews the operational summary for demo or stakeholder sharing

---

## 8. Application Pages

- `/` Landing page
- `/signup` User registration
- `/signin` User login
- `/dashboard` Main monitoring dashboard
- `/nodes` Network nodes list
- `/alerts` Alert center
- `/tests` Test runner
- `/analysis` AI insights page
- `/reports` Operational summary page

---

## 9. UI Design (shadcn/ui)

Use the following components:

- Card
- Button
- Input
- Table
- Badge
- Tabs
- Progress

Layout:

- Sidebar navigation
- Dashboard cards
- Alert, test, and report panels
- Metrics and results tables

---

## 10. Dashboard Layout

### Top Metrics Cards

- Latency
- Throughput
- Packet Loss
- Jitter

### Secondary Overview Cards

- Network Health Score
- Active Alerts
- Latest Test Status
- Recent AI Summary

### Tables and Panels

- Nodes table
- Recent alerts list
- Latest test results

---

## 11. Database Schema (Supabase)

### Table: network_nodes

| Field | Type |
| --- | --- |
| id | uuid |
| name | text |
| location | text |
| node_type | text |
| vendor | text |
| network_slice | text |
| status | text |
| latency | number |
| throughput | number |
| packet_loss | number |
| jitter | number |
| created_at | timestamp |

### Table: network_metrics

| Field | Type |
| --- | --- |
| id | uuid |
| node_id | uuid |
| network_slice | text |
| latency | number |
| throughput | number |
| packet_loss | number |
| jitter | number |
| timestamp | timestamp |

### Table: network_alerts

| Field | Type |
| --- | --- |
| id | uuid |
| node_id | uuid |
| title | text |
| metric_type | text |
| severity | text |
| status | text |
| current_value | number |
| threshold_value | number |
| created_at | timestamp |
| resolved_at | timestamp |

### Table: test_cases

| Field | Type |
| --- | --- |
| id | uuid |
| name | text |
| description | text |
| target_metric | text |
| threshold_operator | text |
| threshold_value | number |
| created_at | timestamp |

### Table: test_results

| Field | Type |
| --- | --- |
| id | uuid |
| test_case_id | uuid |
| node_id | uuid |
| status | text |
| summary | text |
| latency | number |
| throughput | number |
| packet_loss | number |
| jitter | number |
| executed_at | timestamp |

### Table: analysis_reports

| Field | Type |
| --- | --- |
| id | uuid |
| node_id | uuid |
| analysis_summary | text |
| risk_level | text |
| likely_causes | text |
| recommendations | text |
| created_at | timestamp |

---

## 12. Seed Data

Example nodes:

- Ahmedabad 5G Tower - Nokia - eMBB
- Mumbai Core Node - Ericsson - URLLC
- Delhi Edge Node - Samsung - eMBB
- Bangalore Data Center - Nokia - mMTC

Example metrics:

- latency: 18 ms
- throughput: 850 Mbps
- packet_loss: 0.2%
- jitter: 4 ms

Example alerts:

- Warning: packet loss threshold breached in Delhi Edge Node
- Critical: latency spike in Ahmedabad 5G Tower

Example test cases:

- Latency Baseline Check
- Throughput Validation
- Packet Loss Sweep

---

## 13. AI Analysis Logic

Example AI prompt:

Analyze the following 5G network context and identify potential performance issues.

Context:

- latest metrics
- active alerts
- recent test results
- node vendor and network slice

Return:

- detected issues
- severity level
- likely cause
- recommendations
- next action priority

---

## 14. Technical Architecture

The MVP uses Next.js for both UI delivery and backend workflows. It does not rely on a separate frontend SPA or a separate backend service.

### Application Framework

- Next.js (App Router)
- Server Components
- Server Actions and Route Handlers
- Tailwind CSS
- shadcn/ui
- Zod validation

### Data and Auth

- Supabase
- Supabase Authentication
- Supabase PostgreSQL

### Deployment

- Vercel

### AI Tool

- Claude CLI or Codex CLI

### App Capabilities

- Protected dashboard routes
- Server-side data fetching from Supabase
- Seeded telecom demo data
- Test execution and analysis actions from the web app

---

## 15. Security

- Supabase authentication
- Protected routes for dashboard features
- Environment variables for API keys
- No exposed secrets
- Server-only AI keys must never be sent to the client

---

## 16. Deployment Plan

Steps:

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional server-only variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

---

## 17. Demo Video Flow

### 0:00 - 0:30

Explain the problem: monitoring and validating complex 5G networks.

### 0:30 - 2:00

Live demo:

- login
- dashboard
- nodes list

### 2:00 - 3:00

Show alert center and predefined test runner.

### 3:00 - 4:00

Show AI analysis and report summary.

### 4:00 - 5:00

Explain the stack, roadmap, and closing call-to-action.

---

## 18. Future Scope

- Predictive network failures
- Live multi-vendor integrations
- Mobile companion app for field testing
- Network coverage heatmaps
- Digital twin network simulation
- Self-healing test orchestration
