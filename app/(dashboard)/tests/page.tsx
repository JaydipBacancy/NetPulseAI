import { TestRunnerPanel } from "@/components/tests/test-runner-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTestsPageData } from "@/lib/data/tests";
import { requireAuthenticatedWorkspace } from "@/lib/supabase/rbac";
import type {
  SortOrder,
  TestCaseSortBy,
  TestHistorySortBy,
  TestsFilters,
} from "@/types/tests";

type SearchParams = Record<string, string | string[] | undefined>;

type TestsPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const caseSortByValues: TestCaseSortBy[] = [
  "name",
  "category",
  "created_at",
  "pass_threshold",
];
const historySortByValues: TestHistorySortBy[] = [
  "executed_at",
  "status",
  "test_name",
  "node_name",
];
const sortOrders: SortOrder[] = ["asc", "desc"];

function isMetricType(
  value: string | undefined,
): value is NonNullable<TestsFilters["caseMetric"]> {
  return (
    value === "latency_ms" ||
    value === "throughput_mbps" ||
    value === "packet_loss_pct" ||
    value === "jitter_ms"
  );
}

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

function parseFilters(params: SearchParams): TestsFilters {
  const caseSortValue = getSingleParam(params.c_sort);
  const caseOrderValue = getSingleParam(params.c_order);
  const caseMetricValue = getSingleParam(params.c_metric);
  const historySortValue = getSingleParam(params.h_sort);
  const historyOrderValue = getSingleParam(params.h_order);
  const caseActiveValue = getSingleParam(params.c_active);
  const historyStatusValue = getSingleParam(params.h_status);

  return {
    caseActive:
      caseActiveValue === "active" || caseActiveValue === "inactive"
        ? caseActiveValue
        : undefined,
    caseCategory: getSingleParam(params.c_category)?.trim() || undefined,
    caseMetric: isMetricType(caseMetricValue) ? caseMetricValue : undefined,
    casePage: parsePositiveInteger(getSingleParam(params.c_page), 1),
    casePageSize: 6,
    caseQuery: getSingleParam(params.c_q)?.trim() || undefined,
    caseSortBy: caseSortByValues.includes(caseSortValue as TestCaseSortBy)
      ? (caseSortValue as TestCaseSortBy)
      : "name",
    caseSortOrder: sortOrders.includes(caseOrderValue as SortOrder)
      ? (caseOrderValue as SortOrder)
      : "asc",
    historyNodeId: getSingleParam(params.h_node)?.trim() || undefined,
    historyPage: parsePositiveInteger(getSingleParam(params.h_page), 1),
    historyPageSize: 8,
    historyQuery: getSingleParam(params.h_q)?.trim() || undefined,
    historySortBy: historySortByValues.includes(historySortValue as TestHistorySortBy)
      ? (historySortValue as TestHistorySortBy)
      : "executed_at",
    historySortOrder: sortOrders.includes(historyOrderValue as SortOrder)
      ? (historyOrderValue as SortOrder)
      : "desc",
    historyStatus:
      historyStatusValue === "pass" || historyStatusValue === "fail"
        ? historyStatusValue
        : undefined,
  };
}

async function loadTestsPageData(filters: TestsFilters) {
  try {
    return await getTestsPageData(filters);
  } catch {
    return null;
  }
}

export default async function TestsPage({ searchParams }: TestsPageProps) {
  const access = await requireAuthenticatedWorkspace();
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseFilters(resolvedSearchParams);
  const testsPageData = await loadTestsPageData(filters);

  if (!testsPageData) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Tests data unavailable</CardTitle>
          <CardDescription>
            We could not load test cases or run history from Supabase.
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
    <TestRunnerPanel
      canManageOperations={access.permissions.canManageOperations}
      data={testsPageData}
    />
  );
}
