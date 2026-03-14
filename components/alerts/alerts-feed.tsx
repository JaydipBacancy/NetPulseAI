import Link from "next/link";
import { AlertRowActions } from "@/components/alerts/alert-row-actions";
import { CreateAlertForm } from "@/components/alerts/create-alert-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AlertSeverity,
  AlertsFeedData,
  AlertsFilters,
  AlertsSortBy,
  SortOrder,
} from "@/types/alerts";
import type { Database } from "@/types/supabase";

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const severityOptions: AlertSeverity[] = ["critical", "warning", "info"];
const severityClassNames: Record<AlertSeverity, string> = {
  critical: "bg-destructive/15 text-destructive",
  info: "bg-primary/12 text-primary",
  warning: "bg-secondary text-secondary-foreground",
};

function buildAlertsHref(filters: AlertsFilters, updates: Partial<AlertsFilters>) {
  const nextFilters = {
    ...filters,
    ...updates,
  };
  const params = new URLSearchParams();

  params.set("status", nextFilters.status);
  params.set("sort", nextFilters.sortBy);
  params.set("order", nextFilters.sortOrder);
  params.set("page", String(nextFilters.page));

  if (nextFilters.severity) {
    params.set("severity", nextFilters.severity);
  }

  if (nextFilters.metricType) {
    params.set("metric", nextFilters.metricType);
  }

  if (nextFilters.query) {
    params.set("q", nextFilters.query);
  }

  const query = params.toString();
  return query ? `/alerts?${query}` : "/alerts";
}

function createSortHref(filters: AlertsFilters, targetSort: AlertsSortBy) {
  const nextOrder: SortOrder =
    filters.sortBy === targetSort && filters.sortOrder === "asc" ? "desc" : "asc";

  return buildAlertsHref(filters, {
    page: 1,
    sortBy: targetSort,
    sortOrder: nextOrder,
  });
}

function renderSortLabel(filters: AlertsFilters, targetSort: AlertsSortBy, label: string) {
  if (filters.sortBy !== targetSort) {
    return label;
  }

  return `${label} (${filters.sortOrder})`;
}

function formatMetricType(metricType: Database["public"]["Enums"]["metric_type_enum"]) {
  switch (metricType) {
    case "latency_ms":
      return "Latency";
    case "throughput_mbps":
      return "Throughput";
    case "packet_loss_pct":
      return "Packet Loss";
    case "jitter_ms":
      return "Jitter";
    default:
      return metricType;
  }
}

function formatMetricValue(
  metricType: Database["public"]["Enums"]["metric_type_enum"],
  value: number,
) {
  if (metricType === "throughput_mbps") {
    return `${value.toFixed(0)} Mbps`;
  }

  if (metricType === "packet_loss_pct") {
    return `${value.toFixed(2)} %`;
  }

  return `${value.toFixed(1)} ms`;
}

function formatUtcTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return `${utcDateFormatter.format(date)} UTC`;
}

function SearchForm({ filters }: { filters: AlertsFilters }) {
  const clearHref = buildAlertsHref(filters, {
    page: 1,
    query: undefined,
  });

  return (
    <form
      action="/alerts"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={filters.query ?? ""}
        name="q"
        placeholder="Search alert title, summary, or node"
      />
      <input name="status" type="hidden" value={filters.status} />
      <input name="sort" type="hidden" value={filters.sortBy} />
      <input name="order" type="hidden" value={filters.sortOrder} />
      {filters.severity ? <input name="severity" type="hidden" value={filters.severity} /> : null}
      {filters.metricType ? <input name="metric" type="hidden" value={filters.metricType} /> : null}
      <Button className="w-full shrink-0 sm:w-auto" type="submit">
        Search
      </Button>
      {filters.query ? (
        <Button asChild className="w-full shrink-0 sm:w-auto" variant="outline">
          <Link href={clearHref}>Clear</Link>
        </Button>
      ) : null}
    </form>
  );
}

export function AlertsFeed({
  canManageOperations,
  data,
}: {
  canManageOperations: boolean;
  data: AlertsFeedData;
}) {
  const previousPageHref = buildAlertsHref(data.filters, {
    page: Math.max(1, data.filters.page - 1),
  });
  const nextPageHref = buildAlertsHref(data.filters, {
    page: Math.min(data.pagination.totalPages, data.filters.page + 1),
  });
  const statusOptions = [
    {
      href: buildAlertsHref(data.filters, { page: 1, status: "open" }),
      label: `Open (${data.countsByStatus.open})`,
      value: "open",
    },
    {
      href: buildAlertsHref(data.filters, { page: 1, status: "resolved" }),
      label: `Resolved (${data.countsByStatus.resolved})`,
      value: "resolved",
    },
  ];
  const severityOptionsList = [
    {
      href: buildAlertsHref(data.filters, { page: 1, severity: undefined }),
      label: "All severity",
      value: "all",
    },
    ...severityOptions.map((severity) => ({
      href: buildAlertsHref(data.filters, { page: 1, severity }),
      label: severity.toUpperCase(),
      value: severity,
    })),
  ];
  const metricOptions = [
    {
      href: buildAlertsHref(data.filters, { metricType: undefined, page: 1 }),
      label: "All metrics",
      value: "all",
    },
    ...data.options.metricTypes.map((metricType) => ({
      href: buildAlertsHref(data.filters, { metricType, page: 1 }),
      label: formatMetricType(metricType),
      value: metricType,
    })),
  ];

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="space-y-4">
        <div>
          <div>
            <CardTitle>Alert Center</CardTitle>
            <CardDescription className="mt-1">
              {canManageOperations
                ? "CRUD-ready alert feed with filtering, sorting, and pagination."
                : "Read-only alert feed with filtering, sorting, and pagination."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {canManageOperations ? (
          <CreateAlertForm nodes={data.options.nodes} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Viewer access is read-only. Only operators and admins can create or
            resolve alerts.
          </p>
        )}

        <SearchForm filters={data.filters} />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            selectedValue={data.filters.status}
          />
          <FilterDropdown
            label="Severity"
            options={severityOptionsList}
            selectedValue={data.filters.severity ?? "all"}
          />
          <FilterDropdown
            label="Metric"
            options={metricOptions}
            selectedValue={data.filters.metricType ?? "all"}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "title")}
                >
                  {renderSortLabel(data.filters, "title", "Alert Title")}
                </Link>
              </TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "severity")}
                >
                  {renderSortLabel(data.filters, "severity", "Severity")}
                </Link>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "current_value")}
                >
                  {renderSortLabel(data.filters, "current_value", "Current Value")}
                </Link>
              </TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead>
                <Link
                  className="font-medium text-foreground hover:text-primary"
                  href={createSortHref(data.filters, "created_at")}
                >
                  {renderSortLabel(data.filters, "created_at", "Created Time")}
                </Link>
              </TableHead>
              <TableHead>{canManageOperations ? "Actions" : "Access"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.alerts.length > 0 ? (
              data.alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="max-w-[18rem]">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.summary}</p>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-sm font-medium text-primary hover:underline"
                      href={alert.nodeContextHref}
                    >
                      {alert.nodeName}
                    </Link>
                  </TableCell>
                  <TableCell>{formatMetricType(alert.metricType)}</TableCell>
                  <TableCell>
                    <Badge className={severityClassNames[alert.severity]}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.status === "open" ? "outline" : "secondary"}>
                      {alert.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetricValue(alert.metricType, alert.currentValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMetricValue(alert.metricType, alert.thresholdValue)}
                  </TableCell>
                  <TableCell>{formatUtcTimestamp(alert.createdAt)}</TableCell>
                  <TableCell>
                    {canManageOperations ? (
                      <AlertRowActions alertId={alert.id} status={alert.status} />
                    ) : (
                      <Badge variant="outline">Read only</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={9}>
                  No alerts found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {data.alerts.length} out of {data.pagination.totalItems} alerts
            {" | "}
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              disabled={data.pagination.page <= 1}
              size="sm"
              variant="outline"
            >
              <Link href={previousPageHref}>Previous</Link>
            </Button>
            <Button
              asChild
              disabled={data.pagination.page >= data.pagination.totalPages}
              size="sm"
              variant="outline"
            >
              <Link href={nextPageHref}>Next</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
