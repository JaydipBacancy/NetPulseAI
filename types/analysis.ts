import type { Database } from "@/types/supabase";

export type AnalyzeNetworkState = {
  message: string;
  status: "idle" | "server_error" | "success";
  submittedAt?: string;
};

export type SortOrder = "asc" | "desc";
export type AnalysisSortBy = "generated_at" | "risk_level" | "title";

export type AnalysisReportItem = {
  generatedAt: string;
  id: string;
  likelyCauses: string[];
  nodeId: string;
  networkSlice: string;
  nodeName: string;
  recommendations: string[];
  riskLevel: Database["public"]["Enums"]["risk_level_enum"];
  sourceAlertCount: number;
  summary: string;
  title: string;
};

export type AnalysisFilters = {
  page: number;
  pageSize: number;
  query?: string;
  riskLevel?: Database["public"]["Enums"]["risk_level_enum"];
  sortBy: AnalysisSortBy;
  sortOrder: SortOrder;
};

export type AnalysisPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type AnalysisFilterOptions = {
  riskLevels: Database["public"]["Enums"]["risk_level_enum"][];
};

export type AnalysisPageData = {
  context: {
    failedTestCount: number;
    monitoredNodeCount: number;
    openAlertCount: number;
  };
  filters: AnalysisFilters;
  options: AnalysisFilterOptions;
  pagination: AnalysisPagination;
  reports: AnalysisReportItem[];
};
