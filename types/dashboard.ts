import type { Database } from "@/types/supabase";

export type MetricType = Database["public"]["Enums"]["metric_type_enum"];
export type AlertSeverity = Database["public"]["Enums"]["alert_severity_enum"];
export type AlertStatus = Database["public"]["Enums"]["alert_status_enum"];
export type NodeStatus = Database["public"]["Enums"]["node_status_enum"];
export type RiskLevel = Database["public"]["Enums"]["risk_level_enum"];
export type TestStatus = Database["public"]["Enums"]["test_result_status_enum"];

export type DashboardCoreMetric = {
  compliancePct: number;
  label: string;
  metricType: MetricType;
  nodeSampleSize: number;
  thresholdValue: number | null;
  unit: string;
  value: number;
};

export type DashboardMetricChartPoint = {
  nodeName: string;
  value: number;
  withinThreshold: boolean;
};

export type DashboardMetricChart = {
  label: string;
  maxValue: number;
  metricType: MetricType;
  points: DashboardMetricChartPoint[];
  thresholdValue: number | null;
  unit: string;
};

export type DashboardLatestTestResult = {
  executedAt: string;
  nodeName: string;
  status: TestStatus;
  summary: string;
  testName: string;
};

export type DashboardRecentAlert = {
  currentValue: number;
  id: string;
  metricType: MetricType;
  nodeName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  thresholdValue: number;
  title: string;
  triggeredAt: string;
};

export type DashboardRecentTestResult = {
  executedAt: string;
  id: string;
  nodeName: string;
  status: TestStatus;
  summary: string;
  testName: string;
};

export type DashboardRecentAnalysis = {
  generatedAt: string;
  nodeName: string;
  riskLevel: RiskLevel;
  summary: string;
  title: string;
};

export type DashboardHealthSummary = {
  activeAlertCount: number;
  networkHealthScore: number;
  nodeStatusCounts: Record<NodeStatus, number>;
  openSeverityCounts: Record<AlertSeverity, number>;
  scoreBand: "critical" | "stable" | "watch";
};

export type DashboardOverviewData = {
  coreMetrics: DashboardCoreMetric[];
  health: DashboardHealthSummary;
  latestTestResult: DashboardLatestTestResult | null;
  metricCharts: DashboardMetricChart[];
  recentAiSummary: DashboardRecentAnalysis | null;
  recentAlerts: DashboardRecentAlert[];
  recentTestResults: DashboardRecentTestResult[];
};
