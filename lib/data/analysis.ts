import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AnalysisFilters,
  AnalysisPageData,
  AnalysisSortBy,
  SortOrder,
} from "@/types/analysis";
import type { Database } from "@/types/supabase";

type AnalysisReportRow = Pick<
  Database["public"]["Tables"]["analysis_reports"]["Row"],
  "generated_at" | "id" | "likely_causes" | "network_slice" | "node_id" | "recommendations" | "risk_level" | "source_alert_ids" | "summary" | "title"
>;

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "id" | "name"
>;

type QueryResponse<T> = {
  count?: number | null;
  data: T | null;
  error: { message: string } | null;
};

const riskRank: Record<Database["public"]["Enums"]["risk_level_enum"], number> = {
  critical: 4,
  high: 3,
  low: 1,
  medium: 2,
};

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Analysis query failed for ${context}.`);
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

function sortReports(
  reports: AnalysisPageData["reports"],
  sortBy: AnalysisSortBy,
  sortOrder: SortOrder,
) {
  const sortedReports = [...reports];

  sortedReports.sort((a, b) => {
    switch (sortBy) {
      case "risk_level":
        return compareNumbers(riskRank[a.riskLevel], riskRank[b.riskLevel], sortOrder);
      case "title":
        return compareStrings(a.title, b.title, sortOrder);
      case "generated_at":
      default:
        return compareNumbers(
          new Date(a.generatedAt).getTime(),
          new Date(b.generatedAt).getTime(),
          sortOrder,
        );
    }
  });

  return sortedReports;
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

export async function getAnalysisPageData(
  filters: AnalysisFilters,
): Promise<AnalysisPageData> {
  const supabase = await createSupabaseServerClient();
  const [reportsResponse, nodesResponse, openAlertsResponse, failedTestsResponse] =
    await Promise.all([
      supabase
        .from("analysis_reports")
        .select(
          "id,node_id,network_slice,risk_level,title,summary,likely_causes,recommendations,source_alert_ids,generated_at",
        )
        .order("generated_at", { ascending: false })
        .limit(1000),
      supabase.from("network_nodes").select("id,name"),
      supabase
        .from("network_alerts")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("test_results")
        .select("id", { count: "exact", head: true })
        .eq("status", "fail"),
    ]);

  const reports = unwrapQuery<AnalysisReportRow[]>(reportsResponse, "reports");
  const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
  const nodeNameById = new Map(nodes.map((node) => [node.id, node.name]));
  const normalizedQuery = filters.query?.trim().toLowerCase();

  const mappedReports = reports.map((report) => ({
    generatedAt: report.generated_at,
    id: report.id,
    likelyCauses: report.likely_causes,
    networkSlice: report.network_slice,
    nodeId: report.node_id,
    nodeName: nodeNameById.get(report.node_id) ?? "Unknown node",
    recommendations: report.recommendations,
    riskLevel: report.risk_level,
    sourceAlertCount: report.source_alert_ids.length,
    summary: report.summary,
    title: report.title,
  }));

  const filteredReports = mappedReports.filter((report) => {
    const matchesRiskLevel = filters.riskLevel ? report.riskLevel === filters.riskLevel : true;
    const matchesQuery = normalizedQuery
      ? [report.title, report.summary, report.nodeName, report.networkSlice]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    return matchesRiskLevel && matchesQuery;
  });

  const sortedReports = sortReports(filteredReports, filters.sortBy, filters.sortOrder);
  const totalItems = sortedReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.pageSize));
  const page = normalizePage(filters.page, totalPages);
  const start = (page - 1) * filters.pageSize;
  const paginatedReports = sortedReports.slice(start, start + filters.pageSize);

  return {
    context: {
      failedTestCount: failedTestsResponse.count ?? 0,
      monitoredNodeCount: nodes.length,
      openAlertCount: openAlertsResponse.count ?? 0,
    },
    filters: {
      ...filters,
      page,
    },
    options: {
      riskLevels: toUniqueSorted(mappedReports.map((report) => report.riskLevel)),
    },
    pagination: {
      page,
      pageSize: filters.pageSize,
      totalItems,
      totalPages,
    },
    reports: paginatedReports,
  };
}
