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
  return (
    <form action="/alerts" className="flex flex-wrap items-center gap-2">
      <Input defaultValue={filters.query ?? ""} name="q" placeholder="Search title, summary, node" />
      <input name="status" type="hidden" value={filters.status} />
      <input name="sort" type="hidden" value={filters.sortBy} />
      <input name="order" type="hidden" value={filters.sortOrder} />
      {filters.severity ? <input name="severity" type="hidden" value={filters.severity} /> : null}
      {filters.metricType ? <input name="metric" type="hidden" value={filters.metricType} /> : null}
      <Button size="sm" type="submit">
        Search
      </Button>
    </form>
  );
}

export function AlertsFeed({ data }: { data: AlertsFeedData }) {
  const previousPageHref = buildAlertsHref(data.filters, {
    page: Math.max(1, data.filters.page - 1),
  });
  const nextPageHref = buildAlertsHref(data.filters, {
    page: Math.min(data.pagination.totalPages, data.filters.page + 1),
  });

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader className="space-y-4">
        <div>
          <div>
            <CardTitle>Alert Center</CardTitle>
            <CardDescription className="mt-1">
              CRUD-ready alert feed with filtering, sorting, and pagination.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <CreateAlertForm nodes={data.options.nodes} />

        <SearchForm filters={data.filters} />

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={data.filters.status === "open" ? "default" : "outline"}
          >
            <Link href={buildAlertsHref(data.filters, { page: 1, status: "open" })}>
              Open ({data.countsByStatus.open})
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={data.filters.status === "resolved" ? "default" : "outline"}
          >
            <Link href={buildAlertsHref(data.filters, { page: 1, status: "resolved" })}>
              Resolved ({data.countsByStatus.resolved})
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!data.filters.severity ? "default" : "outline"}
          >
            <Link href={buildAlertsHref(data.filters, { page: 1, severity: undefined })}>
              All severity
            </Link>
          </Button>
          {severityOptions.map((severity) => (
            <Button
              asChild
              key={severity}
              size="sm"
              variant={data.filters.severity === severity ? "default" : "outline"}
            >
              <Link href={buildAlertsHref(data.filters, { page: 1, severity })}>
                {severity.toUpperCase()}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={!data.filters.metricType ? "default" : "outline"}
          >
            <Link href={buildAlertsHref(data.filters, { metricType: undefined, page: 1 })}>
              All metrics
            </Link>
          </Button>
          {data.options.metricTypes.map((metricType) => (
            <Button
              asChild
              key={metricType}
              size="sm"
              variant={data.filters.metricType === metricType ? "default" : "outline"}
            >
              <Link href={buildAlertsHref(data.filters, { metricType, page: 1 })}>
                {formatMetricType(metricType)}
              </Link>
            </Button>
          ))}
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
              <TableHead>Actions</TableHead>
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
                    <AlertRowActions alertId={alert.id} status={alert.status} />
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
