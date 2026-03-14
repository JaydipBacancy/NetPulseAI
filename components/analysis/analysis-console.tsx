"use client";

import { useActionState } from "react";
import Link from "next/link";
import { analyzeNetworkAction } from "@/app/actions/analysis";
import { AnalysisReportActions } from "@/components/analysis/analysis-report-actions";
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
import type { AnalysisFilters, AnalysisPageData, AnalyzeNetworkState } from "@/types/analysis";
import type { Database } from "@/types/supabase";

const initialAnalyzeNetworkState: AnalyzeNetworkState = {
  message: "",
  status: "idle",
};

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const riskBadgeClasses: Record<Database["public"]["Enums"]["risk_level_enum"], string> = {
  critical: "bg-destructive/15 text-destructive",
  high: "bg-destructive/15 text-destructive",
  low: "bg-primary/12 text-primary",
  medium: "bg-secondary text-secondary-foreground",
};

function buildAnalysisHref(filters: AnalysisFilters, updates: Partial<AnalysisFilters>) {
  const next = {
    ...filters,
    ...updates,
  };
  const params = new URLSearchParams();

  params.set("sort", next.sortBy);
  params.set("order", next.sortOrder);
  params.set("page", String(next.page));

  if (next.riskLevel) params.set("risk", next.riskLevel);
  if (next.query) params.set("q", next.query);

  const query = params.toString();
  return query ? `/analysis?${query}` : "/analysis";
}

function formatUtcTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return `${utcDateFormatter.format(date)} UTC`;
}

function SearchForm({ filters }: { filters: AnalysisFilters }) {
  const clearHref = buildAnalysisHref(filters, {
    page: 1,
    query: undefined,
  });

  return (
    <form
      action="/analysis"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={filters.query ?? ""}
        name="q"
        placeholder="Search report title, summary, or node"
      />
      <input name="sort" type="hidden" value={filters.sortBy} />
      <input name="order" type="hidden" value={filters.sortOrder} />
      <input name="page" type="hidden" value="1" />
      {filters.riskLevel ? <input name="risk" type="hidden" value={filters.riskLevel} /> : null}
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

export function AnalysisConsole({
  canManageOperations,
  data,
}: {
  canManageOperations: boolean;
  data: AnalysisPageData;
}) {
  const [state, formAction, pending] = useActionState(
    analyzeNetworkAction,
    initialAnalyzeNetworkState,
  );
  const previousPageHref = buildAnalysisHref(data.filters, {
    page: Math.max(1, data.filters.page - 1),
  });
  const nextPageHref = buildAnalysisHref(data.filters, {
    page: Math.min(data.pagination.totalPages, data.filters.page + 1),
  });
  const riskOptions = [
    {
      href: buildAnalysisHref(data.filters, { page: 1, riskLevel: undefined }),
      label: "All risks",
      value: "all",
    },
    ...data.options.riskLevels.map((riskLevel) => ({
      href: buildAnalysisHref(data.filters, { page: 1, riskLevel }),
      label: `${riskLevel.toUpperCase()} risk`,
      value: riskLevel,
    })),
  ];
  const sortOptions = [
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "generated_at",
        sortOrder: "desc",
      }),
      label: "Generated newest first",
      value: "generated_at:desc",
    },
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "generated_at",
        sortOrder: "asc",
      }),
      label: "Generated oldest first",
      value: "generated_at:asc",
    },
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "risk_level",
        sortOrder: "desc",
      }),
      label: "Risk highest first",
      value: "risk_level:desc",
    },
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "risk_level",
        sortOrder: "asc",
      }),
      label: "Risk lowest first",
      value: "risk_level:asc",
    },
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "title",
        sortOrder: "asc",
      }),
      label: "Title A-Z",
      value: "title:asc",
    },
    {
      href: buildAnalysisHref(data.filters, {
        page: 1,
        sortBy: "title",
        sortOrder: "desc",
      }),
      label: "Title Z-A",
      value: "title:desc",
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Console</CardTitle>
          <CardDescription>
            {canManageOperations
              ? "Generate, filter, sort, paginate, update risk level, and delete analysis reports."
              : "Read-only AI report review with filters, history, and operational context."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Open Alerts
              </p>
              <p className="mt-1 text-2xl font-semibold">{data.context.openAlertCount}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Failed Tests
              </p>
              <p className="mt-1 text-2xl font-semibold">{data.context.failedTestCount}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Monitored Nodes
              </p>
              <p className="mt-1 text-2xl font-semibold">{data.context.monitoredNodeCount}</p>
            </div>
          </div>

          {canManageOperations ? (
            <form action={formAction}>
              <Button disabled={pending} type="submit">
                {pending ? "Analyzing..." : "Analyze Network"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Viewer access can inspect reports, but only operators and admins can
              generate or edit analysis output.
            </p>
          )}

          {state.status === "server_error" ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          {state.status === "success" ? (
            <p className="text-sm text-primary">{state.message}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Reports</CardTitle>
          <CardDescription>Operationally relevant analysis lifecycle controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchForm filters={data.filters} />
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <FilterDropdown
              label="Risk"
              options={riskOptions}
              selectedValue={data.filters.riskLevel ?? "all"}
            />
            <FilterDropdown
              label="Sort"
              options={sortOptions}
              selectedValue={`${data.filters.sortBy}:${data.filters.sortOrder}`}
            />
            <div className="flex items-end">
              <Button asChild className="w-full md:w-auto" size="sm" variant="ghost">
                <Link href="/analysis">Reset</Link>
              </Button>
            </div>
          </div>
          {data.reports.length > 0 ? (
            <div className="grid gap-3">
              {data.reports.map((report) => (
                <div
                  className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  key={report.id}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className={riskBadgeClasses[report.riskLevel]}>
                      {report.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Badge variant="outline">{report.nodeName}</Badge>
                    <Badge variant="secondary">{report.networkSlice}</Badge>
                  </div>
                  <p className="font-medium">{report.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Source alerts: {report.sourceAlertCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated: {formatUtcTimestamp(report.generatedAt)}
                  </p>
                  <div className="mt-3">
                    {canManageOperations ? (
                      <AnalysisReportActions
                        reportId={report.id}
                        riskLevel={report.riskLevel}
                      />
                    ) : (
                      <Badge variant="outline">Read only</Badge>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Likely Causes
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {report.likelyCauses.map((cause) => (
                          <li key={cause}>- {cause}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Recommendations
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {report.recommendations.map((recommendation) => (
                          <li key={recommendation}>- {recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No analysis reports match current filters.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button asChild disabled={data.pagination.page <= 1} size="sm" variant="outline">
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
    </div>
  );
}
