import {
  AlertTriangle,
  Bot,
  ClipboardCheck,
  Gauge,
  ListChecks,
  RadioTower,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AlertSeverity,
  DashboardCoreMetric,
  DashboardMetricChart,
  DashboardOverviewData,
  MetricType,
} from "@/types/dashboard";

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const scoreBandClassNames = {
  critical: "bg-destructive/15 text-destructive",
  stable: "bg-primary/12 text-primary",
  watch: "bg-secondary text-secondary-foreground",
};

function formatUtcTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return `${utcDateFormatter.format(date)} UTC`;
}

function formatMetricType(metricType: MetricType) {
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

function formatValueByMetricType(
  metricType: MetricType,
  value: number,
  unit: string,
) {
  const decimals =
    metricType === "throughput_mbps"
      ? 0
      : metricType === "packet_loss_pct"
        ? 2
        : 1;

  return `${value.toFixed(decimals)} ${unit}`;
}

function formatMetricValue(metric: DashboardCoreMetric) {
  return formatValueByMetricType(metric.metricType, metric.value, metric.unit);
}

function formatThreshold(metric: DashboardCoreMetric) {
  if (metric.thresholdValue === null) {
    return "Threshold not configured";
  }

  return formatValueByMetricType(
    metric.metricType,
    metric.thresholdValue,
    metric.unit,
  );
}

function severityClassName(severity: AlertSeverity) {
  if (severity === "critical") {
    return "bg-destructive/15 text-destructive";
  }

  if (severity === "warning") {
    return "bg-secondary text-secondary-foreground";
  }

  return "bg-primary/12 text-primary";
}

function SeverityMixChart({ data }: { data: DashboardOverviewData }) {
  const total =
    data.health.openSeverityCounts.critical +
    data.health.openSeverityCounts.warning +
    data.health.openSeverityCounts.info;
  const criticalPct =
    total > 0 ? Math.round((data.health.openSeverityCounts.critical / total) * 100) : 0;
  const warningPct =
    total > 0 ? Math.round((data.health.openSeverityCounts.warning / total) * 100) : 0;
  const infoPct = total > 0 ? Math.max(0, 100 - criticalPct - warningPct) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Severity Mix</CardTitle>
        <CardDescription>
          Visual split of open alert pressure by severity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div className="flex h-full w-full">
            <div
              className="h-full bg-destructive"
              style={{ width: `${criticalPct}%` }}
            />
            <div
              className="h-full bg-amber-500"
              style={{ width: `${warningPct}%` }}
            />
            <div className="h-full bg-primary" style={{ width: `${infoPct}%` }} />
          </div>
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <p>Critical: {data.health.openSeverityCounts.critical}</p>
          <p>Warning: {data.health.openSeverityCounts.warning}</p>
          <p>Info: {data.health.openSeverityCounts.info}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricDistributionChart({ chart }: { chart: DashboardMetricChart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{chart.label} by Node</CardTitle>
        <CardDescription>
          Latest per-node distribution and threshold compliance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {chart.thresholdValue !== null ? (
          <p className="text-xs text-muted-foreground">
            Threshold baseline:{" "}
            {formatValueByMetricType(
              chart.metricType,
              chart.thresholdValue,
              chart.unit,
            )}
          </p>
        ) : null}
        {chart.points.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {chart.points.map((point) => (
              <li key={`${chart.metricType}-${point.nodeName}`} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-xs text-muted-foreground">{point.nodeName}</p>
                  <p className="text-xs font-medium text-foreground">
                    {formatValueByMetricType(chart.metricType, point.value, chart.unit)}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={
                      point.withinThreshold ? "h-full bg-primary" : "h-full bg-destructive"
                    }
                    style={{
                      width: `${chart.maxValue > 0 ? (point.value / chart.maxValue) * 100 : 0}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No metric samples available for this chart.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview({ data }: { data: DashboardOverviewData }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/12 via-card to-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Gauge className="size-4" />
              Network Health
            </CardDescription>
            <CardTitle className="text-4xl">
              {data.health.networkHealthScore}
              <span className="ml-1 text-lg text-muted-foreground">/ 100</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={scoreBandClassNames[data.health.scoreBand]}>
              {data.health.scoreBand === "stable"
                ? "Stable"
                : data.health.scoreBand === "watch"
                  ? "Watch"
                  : "Critical"}
            </Badge>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <p>Online: {data.health.nodeStatusCounts.online}</p>
              <p>Degraded: {data.health.nodeStatusCounts.degraded}</p>
              <p>Offline: {data.health.nodeStatusCounts.offline}</p>
              <p>Maintenance: {data.health.nodeStatusCounts.maintenance}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Active Alerts
            </CardDescription>
            <CardTitle className="text-4xl">{data.health.activeAlertCount}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge className={severityClassName("critical")}>
              Critical {data.health.openSeverityCounts.critical}
            </Badge>
            <Badge className={severityClassName("warning")}>
              Warning {data.health.openSeverityCounts.warning}
            </Badge>
            <Badge className={severityClassName("info")}>
              Info {data.health.openSeverityCounts.info}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ClipboardCheck className="size-4" />
              Latest Test Result
            </CardDescription>
            <CardTitle className="text-lg">
              {data.latestTestResult?.testName ?? "No test result found"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.latestTestResult ? (
              <>
                <Badge
                  className={
                    data.latestTestResult.status === "pass"
                      ? "bg-primary/12 text-primary"
                      : "bg-destructive/15 text-destructive"
                  }
                >
                  {data.latestTestResult.status.toUpperCase()}
                </Badge>
                <p className="text-muted-foreground">{data.latestTestResult.nodeName}</p>
                <p className="text-muted-foreground">
                  {formatUtcTimestamp(data.latestTestResult.executedAt)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Execute a predefined test case to populate this panel.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bot className="size-4" />
              Recent AI Summary
            </CardDescription>
            <CardTitle className="text-lg">
              {data.recentAiSummary?.title ?? "No analysis report available"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.recentAiSummary ? (
              <>
                <Badge className={scoreBandClassNames[data.recentAiSummary.riskLevel === "low" ? "stable" : data.recentAiSummary.riskLevel === "medium" ? "watch" : "critical"]}>
                  {data.recentAiSummary.riskLevel.toUpperCase()} RISK
                </Badge>
                <p className="text-muted-foreground">{data.recentAiSummary.nodeName}</p>
                <p className="text-muted-foreground">
                  {formatUtcTimestamp(data.recentAiSummary.generatedAt)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Generate an AI analysis to see incident summaries here.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.coreMetrics.map((metric) => (
          <Card key={metric.metricType}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <RadioTower className="size-4" />
                {metric.label}
              </CardDescription>
              <CardTitle className="text-3xl">{formatMetricValue(metric)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">Threshold: {formatThreshold(metric)}</p>
              <p className="text-muted-foreground">Node sample: {metric.nodeSampleSize}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Within threshold: {metric.compliancePct}%
                </p>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${metric.compliancePct}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SeverityMixChart data={data} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metric Compliance Snapshot</CardTitle>
            <CardDescription>
              At-a-glance threshold compliance across the four core metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.coreMetrics.map((metric) => (
              <div
                className="rounded-2xl border border-border/70 bg-background/70 p-3"
                key={`compliance-${metric.metricType}`}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.compliancePct}%</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${metric.compliancePct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metricCharts.map((chart) => (
          <MetricDistributionChart chart={chart} key={`chart-${chart.metricType}`} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="size-4" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest alerts with node and threshold context.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentAlerts.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {data.recentAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge className={severityClassName(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{alert.status.toUpperCase()}</Badge>
                    </div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.nodeName} | {formatMetricType(alert.metricType)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current {alert.currentValue} vs threshold {alert.thresholdValue}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcTimestamp(alert.triggeredAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No alerts available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="size-4" />
              Latest Test Results
            </CardTitle>
            <CardDescription>Most recent predefined test outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentTestResults.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {data.recentTestResults.map((result) => (
                  <li
                    key={result.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          result.status === "pass"
                            ? "bg-primary/12 text-primary"
                            : "bg-destructive/15 text-destructive"
                        }
                      >
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="font-medium">{result.testName}</p>
                    <p className="text-xs text-muted-foreground">{result.nodeName}</p>
                    <p className="text-xs text-muted-foreground">{result.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcTimestamp(result.executedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No test results available.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
