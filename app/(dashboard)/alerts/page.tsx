import { AlertsFeed } from "@/components/alerts/alerts-feed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAlertsFeedData } from "@/lib/data/alerts";
import { requireAuthenticatedWorkspace } from "@/lib/supabase/rbac";
import type {
  AlertMetricType,
  AlertSeverity,
  AlertStatus,
  AlertsFilters,
  AlertsSortBy,
  SortOrder,
} from "@/types/alerts";

type SearchParams = Record<string, string | string[] | undefined>;

type AlertsPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const alertStatuses: AlertStatus[] = ["open", "resolved"];
const alertSeverities: AlertSeverity[] = ["critical", "warning", "info"];
const alertMetricTypes: AlertMetricType[] = [
  "latency_ms",
  "throughput_mbps",
  "packet_loss_pct",
  "jitter_ms",
];
const alertSortByValues: AlertsSortBy[] = [
  "created_at",
  "severity",
  "current_value",
  "title",
];
const sortOrders: SortOrder[] = ["asc", "desc"];

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseFilters(params: SearchParams): AlertsFilters {
  const metricTypeValue = getSingleParam(params.metric);
  const queryValue = getSingleParam(params.q);
  const pageValue = getSingleParam(params.page);
  const sortByValue = getSingleParam(params.sort);
  const sortOrderValue = getSingleParam(params.order);
  const statusValue = getSingleParam(params.status);
  const severityValue = getSingleParam(params.severity);
  const metricType = alertMetricTypes.includes(metricTypeValue as AlertMetricType)
    ? (metricTypeValue as AlertMetricType)
    : undefined;
  const sortBy = alertSortByValues.includes(sortByValue as AlertsSortBy)
    ? (sortByValue as AlertsSortBy)
    : "created_at";
  const sortOrder = sortOrders.includes(sortOrderValue as SortOrder)
    ? (sortOrderValue as SortOrder)
    : "desc";

  return {
    metricType,
    page: parsePositiveInteger(pageValue, 1),
    pageSize: 10,
    query: queryValue?.trim() || undefined,
    severity: alertSeverities.includes(severityValue as AlertSeverity)
      ? (severityValue as AlertSeverity)
      : undefined,
    sortBy,
    sortOrder,
    status: alertStatuses.includes(statusValue as AlertStatus)
      ? (statusValue as AlertStatus)
      : "open",
  };
}

async function loadAlertsFeed(filters: AlertsFilters) {
  try {
    return await getAlertsFeedData(filters);
  } catch {
    return null;
  }
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const access = await requireAuthenticatedWorkspace();
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseFilters(resolvedSearchParams);
  const alertsFeed = await loadAlertsFeed(filters);

  if (!alertsFeed) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Alerts data unavailable</CardTitle>
          <CardDescription>
            We could not load the alert feed from Supabase right now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Verify your database connection and refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AlertsFeed
      canManageOperations={access.permissions.canManageOperations}
      data={alertsFeed}
    />
  );
}
