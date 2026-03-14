import type { Database } from "@/types/supabase";

export type AlertSeverity = Database["public"]["Enums"]["alert_severity_enum"];
export type AlertStatus = Database["public"]["Enums"]["alert_status_enum"];
export type AlertMetricType = Database["public"]["Enums"]["metric_type_enum"];
export type SortOrder = "asc" | "desc";
export type AlertsSortBy = "created_at" | "current_value" | "severity" | "title";

export type AlertsFilters = {
  metricType?: AlertMetricType;
  page: number;
  pageSize: number;
  query?: string;
  severity?: AlertSeverity;
  sortBy: AlertsSortBy;
  sortOrder: SortOrder;
  status: AlertStatus;
};

export type AlertFeedRow = {
  createdAt: string;
  currentValue: number;
  id: string;
  metricType: AlertMetricType;
  nodeContextHref: string;
  nodeId: string;
  nodeName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  summary: string;
  thresholdValue: number;
  title: string;
};

export type AlertsFilterOptions = {
  metricTypes: AlertMetricType[];
  nodes: Array<{ id: string; name: string }>;
};

export type AlertsPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type BaseAlertFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type CreateAlertFieldName =
  | "currentValue"
  | "metricType"
  | "nodeId"
  | "severity"
  | "summary"
  | "thresholdValue"
  | "title";

export type CreateAlertFormState = BaseAlertFormState<CreateAlertFieldName>;

export type AlertsFeedData = {
  alerts: AlertFeedRow[];
  countsByStatus: Record<AlertStatus, number>;
  filters: AlertsFilters;
  options: AlertsFilterOptions;
  pagination: AlertsPagination;
};