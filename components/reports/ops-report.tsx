import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReportsPageData } from "@/types/reports";

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const scoreBandClasses: Record<ReportsPageData["healthSummary"]["scoreBand"], string> = {
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

export function OpsReport({ data }: { data: ReportsPageData }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Operational Report</CardTitle>
          <CardDescription>
            Consolidated network health, alerts, tests, and AI findings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generated at {formatUtcTimestamp(data.generatedAt)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold">
              {data.healthSummary.networkHealthScore}
              <span className="ml-1 text-base text-muted-foreground">/ 100</span>
            </p>
            <Badge className={scoreBandClasses[data.healthSummary.scoreBand]}>
              {data.healthSummary.scoreBand.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Alerts Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold">{data.alertsSummary.openCount}</p>
            <p className="text-sm text-muted-foreground">
              Critical: {data.alertsSummary.critical} | Warning:{" "}
              {data.alertsSummary.warning} | Info: {data.alertsSummary.info}
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {data.alertsSummary.recentTitles.length > 0 ? (
                data.alertsSummary.recentTitles.map((title) => <li key={title}>- {title}</li>)
              ) : (
                <li>No active alert titles to report.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Test Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Recent runs: {data.latestTestOutcomes.recentRunCount} | Pass:{" "}
              {data.latestTestOutcomes.passCount} | Fail: {data.latestTestOutcomes.failCount}
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {data.latestTestOutcomes.latestRuns.length > 0 ? (
                data.latestTestOutcomes.latestRuns.map((run) => (
                  <li key={`${run.testName}-${run.executedAt}`}>
                    - {run.testName} on {run.nodeName} ({run.status.toUpperCase()}) at{" "}
                    {formatUtcTimestamp(run.executedAt)}
                  </li>
                ))
              ) : (
                <li>No test runs available.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest AI Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.latestAnalysis ? (
              <>
                <p className="font-medium">{data.latestAnalysis.title}</p>
                <p className="text-sm text-muted-foreground">{data.latestAnalysis.summary}</p>
                <p className="text-xs text-muted-foreground">
                  Node: {data.latestAnalysis.nodeName} | Risk:{" "}
                  {data.latestAnalysis.riskLevel.toUpperCase()} | Generated:{" "}
                  {formatUtcTimestamp(data.latestAnalysis.generatedAt)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No AI analysis report available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operational Recommendations</CardTitle>
          <CardDescription>Copy-friendly action list for operator handoff.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1 text-sm text-muted-foreground">
            {data.operationalRecommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
