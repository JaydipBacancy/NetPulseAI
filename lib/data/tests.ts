import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  SortOrder,
  TestCaseSortBy,
  TestHistorySortBy,
  TestsFilters,
  TestsPageData,
} from "@/types/tests";
import type { Database } from "@/types/supabase";

type TestCaseRow = Pick<
  Database["public"]["Tables"]["test_cases"]["Row"],
  "category" | "created_at" | "description" | "estimated_duration_seconds" | "id" | "is_active" | "name" | "pass_condition" | "pass_threshold" | "target_metric"
>;

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "id" | "name" | "site_code" | "status"
>;

type TestResultRow = Pick<
  Database["public"]["Tables"]["test_results"]["Row"],
  "executed_at" | "id" | "node_id" | "observed_value" | "status" | "summary" | "test_case_id" | "threshold_value"
>;

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Tests query failed for ${context}.`);
  }

  return response.data;
}

function compareStrings(a: string, b: string, sortOrder: SortOrder) {
  const result = a.localeCompare(b);
  return sortOrder === "asc" ? result : -result;
}

function compareNumbers(a: number, b: number, sortOrder: SortOrder) {
  const result = a - b;
  return sortOrder === "asc" ? result : -result;
}

function normalizePage(page: number, totalPages: number) {
  if (page < 1) {
    return 1;
  }

  if (page > totalPages) {
    return totalPages;
  }

  return page;
}

function toUniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function sortCaseRows(
  rows: TestsPageData["testCases"]["rows"],
  sortBy: TestCaseSortBy,
  sortOrder: SortOrder,
) {
  const sortedRows = [...rows];

  sortedRows.sort((a, b) => {
    switch (sortBy) {
      case "category":
        return compareStrings(a.category, b.category, sortOrder);
      case "pass_threshold":
        return compareNumbers(a.passThreshold, b.passThreshold, sortOrder);
      case "created_at":
        return compareNumbers(
          new Date(a.createdAt).getTime(),
          new Date(b.createdAt).getTime(),
          sortOrder,
        );
      case "name":
      default:
        return compareStrings(a.name, b.name, sortOrder);
    }
  });

  return sortedRows;
}

function sortHistoryRows(
  rows: TestsPageData["history"]["rows"],
  sortBy: TestHistorySortBy,
  sortOrder: SortOrder,
) {
  const sortedRows = [...rows];

  sortedRows.sort((a, b) => {
    switch (sortBy) {
      case "status":
        return compareStrings(a.status, b.status, sortOrder);
      case "node_name":
        return compareStrings(a.nodeName, b.nodeName, sortOrder);
      case "test_name":
        return compareStrings(a.testName, b.testName, sortOrder);
      case "executed_at":
      default:
        return compareNumbers(
          new Date(a.executedAt).getTime(),
          new Date(b.executedAt).getTime(),
          sortOrder,
        );
    }
  });

  return sortedRows;
}

export async function getTestsPageData(filters: TestsFilters): Promise<TestsPageData> {
  const supabase = await createSupabaseServerClient();
  const [testCasesResponse, nodesResponse, historyResponse] = await Promise.all([
    supabase
      .from("test_cases")
      .select(
        "id,name,category,description,target_metric,pass_threshold,pass_condition,estimated_duration_seconds,is_active,created_at",
      ),
    supabase
      .from("network_nodes")
      .select("id,name,site_code,status")
      .order("name", { ascending: true }),
    supabase
      .from("test_results")
      .select(
        "id,test_case_id,node_id,status,summary,observed_value,threshold_value,executed_at",
      )
      .order("executed_at", { ascending: false })
      .limit(2000),
  ]);

  const testCases = unwrapQuery<TestCaseRow[]>(testCasesResponse, "test cases");
  const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
  const history = unwrapQuery<TestResultRow[]>(historyResponse, "test history");
  const testCaseNameById = new Map(testCases.map((testCase) => [testCase.id, testCase.name]));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const normalizedCaseQuery = filters.caseQuery?.trim().toLowerCase();
  const normalizedHistoryQuery = filters.historyQuery?.trim().toLowerCase();

  const mappedTestCases = testCases.map((testCase) => ({
    category: testCase.category,
    createdAt: testCase.created_at,
    description: testCase.description,
    estimatedDurationSeconds: testCase.estimated_duration_seconds,
    id: testCase.id,
    isActive: testCase.is_active,
    name: testCase.name,
    passCondition: testCase.pass_condition,
    passThreshold: testCase.pass_threshold,
    targetMetric: testCase.target_metric,
  }));

  const filteredCaseRows = mappedTestCases.filter((testCase) => {
    const matchesActive =
      filters.caseActive === "active"
        ? testCase.isActive
        : filters.caseActive === "inactive"
          ? !testCase.isActive
          : true;
    const matchesCategory = filters.caseCategory
      ? testCase.category === filters.caseCategory
      : true;
    const matchesMetric = filters.caseMetric
      ? testCase.targetMetric === filters.caseMetric
      : true;
    const matchesQuery = normalizedCaseQuery
      ? [testCase.name, testCase.description, testCase.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedCaseQuery)
      : true;

    return matchesActive && matchesCategory && matchesMetric && matchesQuery;
  });

  const sortedCaseRows = sortCaseRows(
    filteredCaseRows,
    filters.caseSortBy,
    filters.caseSortOrder,
  );
  const caseTotalItems = sortedCaseRows.length;
  const caseTotalPages = Math.max(1, Math.ceil(caseTotalItems / filters.casePageSize));
  const casePage = normalizePage(filters.casePage, caseTotalPages);
  const caseStart = (casePage - 1) * filters.casePageSize;
  const paginatedCaseRows = sortedCaseRows.slice(
    caseStart,
    caseStart + filters.casePageSize,
  );

  const mappedHistoryRows = history.map((item) => ({
    executedAt: item.executed_at,
    id: item.id,
    nodeId: item.node_id,
    nodeName: nodeById.get(item.node_id)?.name ?? "Unknown node",
    observedValue: item.observed_value,
    status: item.status,
    summary: item.summary,
    testCaseId: item.test_case_id,
    testName: testCaseNameById.get(item.test_case_id) ?? "Unknown test",
    thresholdValue: item.threshold_value,
  }));

  const filteredHistoryRows = mappedHistoryRows.filter((row) => {
    const matchesStatus = filters.historyStatus ? row.status === filters.historyStatus : true;
    const matchesNode = filters.historyNodeId ? row.nodeId === filters.historyNodeId : true;
    const matchesQuery = normalizedHistoryQuery
      ? [row.summary, row.testName, row.nodeName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedHistoryQuery)
      : true;

    return matchesStatus && matchesNode && matchesQuery;
  });

  const sortedHistoryRows = sortHistoryRows(
    filteredHistoryRows,
    filters.historySortBy,
    filters.historySortOrder,
  );
  const historyTotalItems = sortedHistoryRows.length;
  const historyTotalPages = Math.max(
    1,
    Math.ceil(historyTotalItems / filters.historyPageSize),
  );
  const historyPage = normalizePage(filters.historyPage, historyTotalPages);
  const historyStart = (historyPage - 1) * filters.historyPageSize;
  const paginatedHistoryRows = sortedHistoryRows.slice(
    historyStart,
    historyStart + filters.historyPageSize,
  );
  const runTestCases = mappedTestCases
    .map((testCase) => ({
      category: testCase.category,
      id: testCase.id,
      isActive: testCase.isActive,
      name: testCase.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    filters: {
      ...filters,
      casePage,
      historyPage,
    },
    history: {
      pagination: {
        page: historyPage,
        pageSize: filters.historyPageSize,
        totalItems: historyTotalItems,
        totalPages: historyTotalPages,
      },
      rows: paginatedHistoryRows,
    },
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      siteCode: node.site_code,
      status: node.status,
    })),
    options: {
      caseCategories: toUniqueSorted(mappedTestCases.map((testCase) => testCase.category)),
      caseMetrics: toUniqueSorted(mappedTestCases.map((testCase) => testCase.targetMetric)),
      historyNodes: nodes.map((node) => ({
        id: node.id,
        name: node.name,
        siteCode: node.site_code,
        status: node.status,
      })),
      historyStatuses: ["pass", "fail"],
    },
    runTestCases,
    testCases: {
      pagination: {
        page: casePage,
        pageSize: filters.casePageSize,
        totalItems: caseTotalItems,
        totalPages: caseTotalPages,
      },
      rows: paginatedCaseRows,
    },
  };
}
