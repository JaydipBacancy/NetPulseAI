import type { Database } from "@/types/supabase";
import type { AlertMetricType } from "@/types/alerts";

type BaseRunTestFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type RunTestFieldName = "nodeId" | "testCaseId";
export type RunTestFormState = BaseRunTestFormState<RunTestFieldName>;
export type SortOrder = "asc" | "desc";
export type TestCaseSortBy = "category" | "created_at" | "name" | "pass_threshold";
export type TestHistorySortBy = "executed_at" | "node_name" | "status" | "test_name";

export type TestCaseOption = {
  category: string;
  createdAt: string;
  description: string;
  estimatedDurationSeconds: number;
  id: string;
  isActive: boolean;
  name: string;
  passCondition: Database["public"]["Enums"]["test_operator_enum"];
  passThreshold: number;
  targetMetric: AlertMetricType;
};

export type RunnableTestCaseOption = {
  category: string;
  id: string;
  isActive: boolean;
  name: string;
};

export type TestNodeOption = {
  id: string;
  name: string;
  siteCode: string;
  status: Database["public"]["Enums"]["node_status_enum"];
};

export type TestRunHistoryItem = {
  executedAt: string;
  id: string;
  nodeId: string;
  nodeName: string;
  observedValue: number;
  status: Database["public"]["Enums"]["test_result_status_enum"];
  summary: string;
  testCaseId: string;
  testName: string;
  thresholdValue: number;
};

export type TestsFilters = {
  caseActive?: "active" | "inactive";
  caseCategory?: string;
  caseMetric?: AlertMetricType;
  casePage: number;
  casePageSize: number;
  caseQuery?: string;
  caseSortBy: TestCaseSortBy;
  caseSortOrder: SortOrder;
  historyNodeId?: string;
  historyPage: number;
  historyPageSize: number;
  historyQuery?: string;
  historySortBy: TestHistorySortBy;
  historySortOrder: SortOrder;
  historyStatus?: Database["public"]["Enums"]["test_result_status_enum"];
};

export type TestsFilterOptions = {
  caseCategories: string[];
  caseMetrics: AlertMetricType[];
  historyNodes: TestNodeOption[];
  historyStatuses: Database["public"]["Enums"]["test_result_status_enum"][];
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type BaseTestCaseFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type CreateTestCaseFieldName =
  | "category"
  | "description"
  | "estimatedDurationSeconds"
  | "name"
  | "passCondition"
  | "passThreshold"
  | "slug"
  | "targetMetric";

export type CreateTestCaseFormState = BaseTestCaseFormState<CreateTestCaseFieldName>;

export type TestsPageData = {
  filters: TestsFilters;
  history: {
    pagination: PaginationMeta;
    rows: TestRunHistoryItem[];
  };
  nodes: TestNodeOption[];
  options: TestsFilterOptions;
  runTestCases: RunnableTestCaseOption[];
  testCases: {
    pagination: PaginationMeta;
    rows: TestCaseOption[];
  };
};