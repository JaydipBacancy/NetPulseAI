"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createTestCaseAction } from "@/app/actions/test-cases";
import { runPredefinedTestAction } from "@/app/actions/tests";
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
import { Label } from "@/components/ui/label";
import { TestCaseActions } from "@/components/tests/test-case-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CreateTestCaseFormState,
  RunTestFormState,
  SortOrder,
  TestHistorySortBy,
  TestsFilters,
  TestsPageData,
} from "@/types/tests";
import { toast } from "sonner";

const initialRunTestFormState: RunTestFormState = {
  fieldErrors: {},
  message: "",
  resultStatus: undefined,
  status: "idle",
  values: {},
};

const initialCreateTestCaseState: CreateTestCaseFormState = {
  fieldErrors: {},
  message: "",
  status: "idle",
  values: {},
};

const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-border/70 bg-card/92 px-4 py-2 text-sm text-foreground shadow-[0_12px_30px_-24px_rgba(15,23,42,0.18)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

function buildTestsHref(filters: TestsFilters, updates: Partial<TestsFilters>) {
  const next = {
    ...filters,
    ...updates,
  };
  const params = new URLSearchParams();

  params.set("c_sort", next.caseSortBy);
  params.set("c_order", next.caseSortOrder);
  params.set("c_page", String(next.casePage));
  params.set("h_sort", next.historySortBy);
  params.set("h_order", next.historySortOrder);
  params.set("h_page", String(next.historyPage));

  if (next.caseQuery) params.set("c_q", next.caseQuery);
  if (next.caseCategory) params.set("c_category", next.caseCategory);
  if (next.caseMetric) params.set("c_metric", next.caseMetric);
  if (next.caseActive) params.set("c_active", next.caseActive);
  if (next.historyQuery) params.set("h_q", next.historyQuery);
  if (next.historyStatus) params.set("h_status", next.historyStatus);
  if (next.historyNodeId) params.set("h_node", next.historyNodeId);

  const query = params.toString();
  return query ? `/tests?${query}` : "/tests";
}

function createHistorySortHref(filters: TestsFilters, targetSort: TestHistorySortBy) {
  const nextOrder: SortOrder =
    filters.historySortBy === targetSort && filters.historySortOrder === "asc"
      ? "desc"
      : "asc";

  return buildTestsHref(filters, {
    historyPage: 1,
    historySortBy: targetSort,
    historySortOrder: nextOrder,
  });
}

function renderHistorySortLabel(
  filters: TestsFilters,
  targetSort: TestHistorySortBy,
  label: string,
) {
  if (filters.historySortBy !== targetSort) {
    return label;
  }

  return `${label} (${filters.historySortOrder})`;
}

function formatUtcTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return `${utcDateFormatter.format(date)} UTC`;
}

function formatMetricType(value: string) {
  if (value === "latency_ms") return "Latency";
  if (value === "throughput_mbps") return "Throughput";
  if (value === "packet_loss_pct") return "Packet Loss";
  if (value === "jitter_ms") return "Jitter";
  return value;
}

function CaseSearchForm({ filters }: { filters: TestsFilters }) {
  const clearHref = buildTestsHref(filters, {
    casePage: 1,
    caseQuery: undefined,
  });

  return (
    <form
      action="/tests"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={filters.caseQuery ?? ""}
        name="c_q"
        placeholder="Search test case name, category, or metric"
      />
      <input name="c_sort" type="hidden" value={filters.caseSortBy} />
      <input name="c_order" type="hidden" value={filters.caseSortOrder} />
      <input name="c_page" type="hidden" value="1" />
      <input name="h_sort" type="hidden" value={filters.historySortBy} />
      <input name="h_order" type="hidden" value={filters.historySortOrder} />
      <input name="h_page" type="hidden" value={filters.historyPage} />
      {filters.caseCategory ? <input name="c_category" type="hidden" value={filters.caseCategory} /> : null}
      {filters.caseMetric ? <input name="c_metric" type="hidden" value={filters.caseMetric} /> : null}
      {filters.caseActive ? <input name="c_active" type="hidden" value={filters.caseActive} /> : null}
      {filters.historyQuery ? <input name="h_q" type="hidden" value={filters.historyQuery} /> : null}
      {filters.historyStatus ? <input name="h_status" type="hidden" value={filters.historyStatus} /> : null}
      {filters.historyNodeId ? <input name="h_node" type="hidden" value={filters.historyNodeId} /> : null}
      <Button className="w-full shrink-0 sm:w-auto" type="submit">
        Search
      </Button>
      {filters.caseQuery ? (
        <Button asChild className="w-full shrink-0 sm:w-auto" variant="outline">
          <Link href={clearHref}>Clear</Link>
        </Button>
      ) : null}
    </form>
  );
}

function HistorySearchForm({ filters }: { filters: TestsFilters }) {
  const clearHref = buildTestsHref(filters, {
    historyPage: 1,
    historyQuery: undefined,
  });

  return (
    <form
      action="/tests"
      className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        className="min-w-0 sm:flex-1"
        defaultValue={filters.historyQuery ?? ""}
        name="h_q"
        placeholder="Search test, node, or execution summary"
      />
      <input name="h_sort" type="hidden" value={filters.historySortBy} />
      <input name="h_order" type="hidden" value={filters.historySortOrder} />
      <input name="h_page" type="hidden" value="1" />
      <input name="c_sort" type="hidden" value={filters.caseSortBy} />
      <input name="c_order" type="hidden" value={filters.caseSortOrder} />
      <input name="c_page" type="hidden" value={filters.casePage} />
      {filters.caseQuery ? <input name="c_q" type="hidden" value={filters.caseQuery} /> : null}
      {filters.caseCategory ? <input name="c_category" type="hidden" value={filters.caseCategory} /> : null}
      {filters.caseMetric ? <input name="c_metric" type="hidden" value={filters.caseMetric} /> : null}
      {filters.caseActive ? <input name="c_active" type="hidden" value={filters.caseActive} /> : null}
      {filters.historyStatus ? <input name="h_status" type="hidden" value={filters.historyStatus} /> : null}
      {filters.historyNodeId ? <input name="h_node" type="hidden" value={filters.historyNodeId} /> : null}
      <Button className="w-full shrink-0 sm:w-auto" type="submit">
        Search
      </Button>
      {filters.historyQuery ? (
        <Button asChild className="w-full shrink-0 sm:w-auto" variant="outline">
          <Link href={clearHref}>Clear</Link>
        </Button>
      ) : null}
    </form>
  );
}

export function TestRunnerPanel({
  canManageOperations,
  data,
}: {
  canManageOperations: boolean;
  data: TestsPageData;
}) {
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [runState, runFormAction, runPending] = useActionState(
    runPredefinedTestAction,
    initialRunTestFormState,
  );
  const [createCaseState, createCaseAction, createCasePending] = useActionState(
    async (previousState: CreateTestCaseFormState, formData: FormData) => {
      const nextState = await createTestCaseAction(previousState, formData);

      if (nextState.status === "success") {
        setIsCreateCaseModalOpen(false);
        toast.success(nextState.message);
      } else if (nextState.status === "server_error") {
        toast.error(nextState.message);
      }

      return nextState;
    },
    initialCreateTestCaseState,
  );

  const previousCasePageHref = buildTestsHref(data.filters, {
    casePage: Math.max(1, data.filters.casePage - 1),
  });
  const nextCasePageHref = buildTestsHref(data.filters, {
    casePage: Math.min(data.testCases.pagination.totalPages, data.filters.casePage + 1),
  });
  const previousHistoryPageHref = buildTestsHref(data.filters, {
    historyPage: Math.max(1, data.filters.historyPage - 1),
  });
  const nextHistoryPageHref = buildTestsHref(data.filters, {
    historyPage: Math.min(data.history.pagination.totalPages, data.filters.historyPage + 1),
  });
  const caseActiveOptions = [
    {
      href: buildTestsHref(data.filters, { caseActive: undefined, casePage: 1 }),
      label: "All test cases",
      value: "all",
    },
    {
      href: buildTestsHref(data.filters, { caseActive: "active", casePage: 1 }),
      label: "Active only",
      value: "active",
    },
    {
      href: buildTestsHref(data.filters, { caseActive: "inactive", casePage: 1 }),
      label: "Inactive only",
      value: "inactive",
    },
  ];
  const caseCategoryOptions = [
    {
      href: buildTestsHref(data.filters, { caseCategory: undefined, casePage: 1 }),
      label: "All categories",
      value: "all",
    },
    ...data.options.caseCategories.map((category) => ({
      href: buildTestsHref(data.filters, { caseCategory: category, casePage: 1 }),
      label: category,
      value: category,
    })),
  ];
  const caseMetricOptions = [
    {
      href: buildTestsHref(data.filters, { caseMetric: undefined, casePage: 1 }),
      label: "All metrics",
      value: "all",
    },
    ...data.options.caseMetrics.map((metric) => ({
      href: buildTestsHref(data.filters, { caseMetric: metric, casePage: 1 }),
      label: formatMetricType(metric),
      value: metric,
    })),
  ];
  const caseSortDropdownOptions = [
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "name",
        caseSortOrder: "asc",
      }),
      label: "Name A-Z",
      value: "name:asc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "name",
        caseSortOrder: "desc",
      }),
      label: "Name Z-A",
      value: "name:desc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "category",
        caseSortOrder: "asc",
      }),
      label: "Category A-Z",
      value: "category:asc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "category",
        caseSortOrder: "desc",
      }),
      label: "Category Z-A",
      value: "category:desc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "created_at",
        caseSortOrder: "desc",
      }),
      label: "Newest created first",
      value: "created_at:desc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "created_at",
        caseSortOrder: "asc",
      }),
      label: "Oldest created first",
      value: "created_at:asc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "pass_threshold",
        caseSortOrder: "asc",
      }),
      label: "Threshold low-high",
      value: "pass_threshold:asc",
    },
    {
      href: buildTestsHref(data.filters, {
        casePage: 1,
        caseSortBy: "pass_threshold",
        caseSortOrder: "desc",
      }),
      label: "Threshold high-low",
      value: "pass_threshold:desc",
    },
  ];
  const historyStatusOptions = [
    {
      href: buildTestsHref(data.filters, { historyPage: 1, historyStatus: undefined }),
      label: "All status",
      value: "all",
    },
    {
      href: buildTestsHref(data.filters, { historyPage: 1, historyStatus: "pass" }),
      label: "PASS",
      value: "pass",
    },
    {
      href: buildTestsHref(data.filters, { historyPage: 1, historyStatus: "fail" }),
      label: "FAIL",
      value: "fail",
    },
  ];
  const historyNodeOptions = [
    {
      href: buildTestsHref(data.filters, { historyNodeId: undefined, historyPage: 1 }),
      label: "All nodes",
      value: "all",
    },
    ...data.options.historyNodes.map((node) => ({
      href: buildTestsHref(data.filters, {
        historyNodeId: node.id,
        historyPage: 1,
      }),
      label: `${node.name} (${node.siteCode})`,
      value: node.id,
    })),
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Run Predefined Test</CardTitle>
          <CardDescription>
            {canManageOperations
              ? "Execute active test cases against selected nodes and persist results."
              : "Read-only execution view. Operators and admins run predefined tests."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canManageOperations ? (
            <form action={runFormAction} className="grid gap-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="run-testCaseId">Test case</Label>
                <select
                  className={selectClassName}
                  defaultValue={runState.values.testCaseId ?? ""}
                  id="run-testCaseId"
                  name="testCaseId"
                >
                  <option value="">Select predefined test case</option>
                  {data.runTestCases
                    .filter((testCase) => testCase.isActive)
                    .map((testCase) => (
                      <option key={testCase.id} value={testCase.id}>
                        {testCase.name} ({testCase.category})
                      </option>
                    ))}
                </select>
                {runState.fieldErrors.testCaseId?.[0] ? (
                  <p className="text-sm text-destructive">{runState.fieldErrors.testCaseId[0]}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="run-nodeId">Node</Label>
                <select
                  className={selectClassName}
                  defaultValue={runState.values.nodeId ?? ""}
                  id="run-nodeId"
                  name="nodeId"
                >
                  <option value="">Select target node</option>
                  {data.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.siteCode}) - {node.status}
                    </option>
                  ))}
                </select>
                {runState.fieldErrors.nodeId?.[0] ? (
                  <p className="text-sm text-destructive">{runState.fieldErrors.nodeId[0]}</p>
                ) : null}
              </div>

              {runState.status === "server_error" ? (
                <p className="text-sm text-destructive">{runState.message}</p>
              ) : null}
              {runState.status === "success" ? (
                <p
                  className={
                    runState.resultStatus === "fail"
                      ? "text-sm text-destructive"
                      : "text-sm text-primary"
                  }
                >
                  {runState.message}
                </p>
              ) : null}

              <Button disabled={runPending} type="submit">
                {runPending ? "Running test..." : "Run test"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Viewer access can review test cases and history, but cannot execute tests
              or change thresholds.
            </p>
          )}
        </CardContent>
      </Card>

      {canManageOperations && isCreateCaseModalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-4"
          onClick={() => setIsCreateCaseModalOpen(false)}
        >
          <div
            aria-labelledby="create-test-case-title"
            aria-modal="true"
            className="mx-auto mt-8 max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-semibold" id="create-test-case-title">
                Create Test Case
              </p>
              <Button
                onClick={() => setIsCreateCaseModalOpen(false)}
                type="button"
                variant="outline"
              >
                Close
              </Button>
            </div>
            <form action={createCaseAction} className="grid gap-3" noValidate>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="case-name">Name</Label>
                  <Input
                    defaultValue={createCaseState.values.name ?? ""}
                    id="case-name"
                    name="name"
                    placeholder="Latency Regression Guard"
                  />
                  {createCaseState.fieldErrors.name?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.name[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-slug">Slug</Label>
                  <Input
                    defaultValue={createCaseState.values.slug ?? ""}
                    id="case-slug"
                    name="slug"
                    placeholder="latency-regression-guard"
                  />
                  {createCaseState.fieldErrors.slug?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.slug[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-category">Category</Label>
                  <Input
                    defaultValue={createCaseState.values.category ?? ""}
                    id="case-category"
                    name="category"
                    placeholder="QoS"
                  />
                  {createCaseState.fieldErrors.category?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.category[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-targetMetric">Target metric</Label>
                  <select
                    className={selectClassName}
                    defaultValue={createCaseState.values.targetMetric || "latency_ms"}
                    id="case-targetMetric"
                    name="targetMetric"
                  >
                    <option value="latency_ms">latency_ms</option>
                    <option value="throughput_mbps">throughput_mbps</option>
                    <option value="packet_loss_pct">packet_loss_pct</option>
                    <option value="jitter_ms">jitter_ms</option>
                  </select>
                  {createCaseState.fieldErrors.targetMetric?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.targetMetric[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-passCondition">Pass condition</Label>
                  <select
                    className={selectClassName}
                    defaultValue={createCaseState.values.passCondition || "lte"}
                    id="case-passCondition"
                    name="passCondition"
                  >
                    <option value="lte">lte</option>
                    <option value="gte">gte</option>
                  </select>
                  {createCaseState.fieldErrors.passCondition?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.passCondition[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-passThreshold">Pass threshold</Label>
                  <Input
                    defaultValue={createCaseState.values.passThreshold ?? ""}
                    id="case-passThreshold"
                    name="passThreshold"
                    step="0.01"
                    type="number"
                  />
                  {createCaseState.fieldErrors.passThreshold?.[0] ? (
                    <p className="text-sm text-destructive">{createCaseState.fieldErrors.passThreshold[0]}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case-duration">Duration (seconds)</Label>
                  <Input
                    defaultValue={createCaseState.values.estimatedDurationSeconds ?? ""}
                    id="case-duration"
                    name="estimatedDurationSeconds"
                    step="1"
                    type="number"
                  />
                  {createCaseState.fieldErrors.estimatedDurationSeconds?.[0] ? (
                    <p className="text-sm text-destructive">
                      {createCaseState.fieldErrors.estimatedDurationSeconds[0]}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-description">Description</Label>
                <Input
                  defaultValue={createCaseState.values.description ?? ""}
                  id="case-description"
                  name="description"
                  placeholder="Checks sustained latency under expected slice load."
                />
              {createCaseState.fieldErrors.description?.[0] ? (
                <p className="text-sm text-destructive">{createCaseState.fieldErrors.description[0]}</p>
              ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Button disabled={createCasePending} type="submit">
                  {createCasePending ? "Creating..." : "Create test case"}
                </Button>
                <Button
                  onClick={() => setIsCreateCaseModalOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>
              {canManageOperations
                ? "Manage predefined test cases (filter, sort, update, delete)."
                : "Review predefined test cases with full audit context."}
            </CardDescription>
          </div>
          {canManageOperations ? (
            <Button onClick={() => setIsCreateCaseModalOpen(true)} type="button">
              Create Test Case
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {!canManageOperations ? (
            <p className="text-sm text-muted-foreground">
              Viewer access is read-only. Role changes are handled from the admin panel.
            </p>
          ) : null}
          <CaseSearchForm filters={data.filters} />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <FilterDropdown
              label="Availability"
              options={caseActiveOptions}
              selectedValue={data.filters.caseActive ?? "all"}
            />
            <FilterDropdown
              label="Category"
              options={caseCategoryOptions}
              selectedValue={data.filters.caseCategory ?? "all"}
            />
            <FilterDropdown
              label="Metric"
              options={caseMetricOptions}
              selectedValue={data.filters.caseMetric ?? "all"}
            />
            <FilterDropdown
              label="Sort"
              options={caseSortDropdownOptions}
              selectedValue={`${data.filters.caseSortBy}:${data.filters.caseSortOrder}`}
            />
            <div className="flex items-end">
              <Button asChild className="w-full md:w-auto" size="sm" variant="ghost">
                <Link href="/tests">Reset</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {data.testCases.rows.length > 0 ? (
              data.testCases.rows.map((testCase) => (
                <div
                  className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  key={testCase.id}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{testCase.category}</Badge>
                    <Badge variant="outline">{formatMetricType(testCase.targetMetric)}</Badge>
                    <Badge variant={testCase.isActive ? "default" : "outline"}>
                      {testCase.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                  <p className="font-medium">{testCase.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{testCase.description}</p>
                  <div className="mt-3">
                    {canManageOperations ? (
                      <TestCaseActions
                        isActive={testCase.isActive}
                        passCondition={testCase.passCondition}
                        passThreshold={testCase.passThreshold}
                        testCaseId={testCase.id}
                      />
                    ) : (
                      <Badge variant="outline">Read only</Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No test cases match current filters.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Showing {data.testCases.rows.length} out of {data.testCases.pagination.totalItems} test cases
              {" | "}
              Page {data.testCases.pagination.page} of {data.testCases.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button asChild disabled={data.testCases.pagination.page <= 1} size="sm" variant="outline">
                <Link href={previousCasePageHref}>Previous</Link>
              </Button>
              <Button
                asChild
                disabled={data.testCases.pagination.page >= data.testCases.pagination.totalPages}
                size="sm"
                variant="outline"
              >
                <Link href={nextCasePageHref}>Next</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
          <CardDescription>Filter, sort, and paginate recent test executions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <HistorySearchForm filters={data.filters} />
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <FilterDropdown
              label="Result"
              options={historyStatusOptions}
              selectedValue={data.filters.historyStatus ?? "all"}
            />
            <FilterDropdown
              label="Node"
              options={historyNodeOptions}
              selectedValue={data.filters.historyNodeId ?? "all"}
            />
            <div className="flex items-end">
              <Button asChild className="w-full md:w-auto" size="sm" variant="ghost">
                <Link
                  href={buildTestsHref(data.filters, {
                    historyNodeId: undefined,
                    historyPage: 1,
                    historyQuery: undefined,
                    historyStatus: undefined,
                  })}
                >
                  Clear history filters
                </Link>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={createHistorySortHref(data.filters, "test_name")}
                  >
                    {renderHistorySortLabel(data.filters, "test_name", "Test")}
                  </Link>
                </TableHead>
                <TableHead>
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={createHistorySortHref(data.filters, "node_name")}
                  >
                    {renderHistorySortLabel(data.filters, "node_name", "Node")}
                  </Link>
                </TableHead>
                <TableHead>
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={createHistorySortHref(data.filters, "status")}
                  >
                    {renderHistorySortLabel(data.filters, "status", "Status")}
                  </Link>
                </TableHead>
                <TableHead className="text-right">Observed</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead>
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={createHistorySortHref(data.filters, "executed_at")}
                  >
                    {renderHistorySortLabel(data.filters, "executed_at", "Execution Time")}
                  </Link>
                </TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.history.rows.length > 0 ? (
                data.history.rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.testName}</TableCell>
                    <TableCell>{item.nodeName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.status === "pass"
                            ? "bg-primary/12 text-primary"
                            : "bg-destructive/15 text-destructive"
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.observedValue}</TableCell>
                    <TableCell className="text-right">{item.thresholdValue}</TableCell>
                    <TableCell>{formatUtcTimestamp(item.executedAt)}</TableCell>
                    <TableCell className="max-w-[24rem] text-sm text-muted-foreground">
                      {item.summary}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={7}>
                    No test executions found for current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Showing {data.history.rows.length} out of {data.history.pagination.totalItems} history records
              {" | "}
              Page {data.history.pagination.page} of {data.history.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button asChild disabled={data.history.pagination.page <= 1} size="sm" variant="outline">
                <Link href={previousHistoryPageHref}>Previous</Link>
              </Button>
              <Button
                asChild
                disabled={data.history.pagination.page >= data.history.pagination.totalPages}
                size="sm"
                variant="outline"
              >
                <Link href={nextHistoryPageHref}>Next</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
