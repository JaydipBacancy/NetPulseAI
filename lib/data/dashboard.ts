import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AlertSeverity,
  DashboardCoreMetric,
  DashboardMetricChart,
  DashboardOverviewData,
  MetricType,
  NodeStatus,
} from "@/types/dashboard";
import type { Database } from "@/types/supabase";

const coreMetricOrder: MetricType[] = [
  "latency_ms",
  "throughput_mbps",
  "packet_loss_pct",
  "jitter_ms",
];

const coreMetricConfig: Record<MetricType, { label: string; unit: string }> = {
  jitter_ms: { label: "Jitter", unit: "ms" },
  latency_ms: { label: "Latency", unit: "ms" },
  packet_loss_pct: { label: "Packet Loss", unit: "%" },
  throughput_mbps: { label: "Throughput", unit: "Mbps" },
};

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "availability_pct" | "id" | "name" | "status"
>;

type MetricRow = Pick<
  Database["public"]["Tables"]["network_metrics"]["Row"],
  "metric_type" | "metric_value" | "node_id" | "recorded_at" | "threshold_value" | "unit"
>;

type AlertRow = Pick<
  Database["public"]["Tables"]["network_alerts"]["Row"],
  "current_value" | "id" | "metric_type" | "node_id" | "severity" | "status" | "threshold_value" | "title" | "triggered_at"
>;

type TestCaseRow = Pick<
  Database["public"]["Tables"]["test_cases"]["Row"],
  "id" | "name"
>;

type TestResultRow = Pick<
  Database["public"]["Tables"]["test_results"]["Row"],
  "executed_at" | "id" | "node_id" | "status" | "summary" | "test_case_id"
>;

type AnalysisReportRow = Pick<
  Database["public"]["Tables"]["analysis_reports"]["Row"],
  "generated_at" | "node_id" | "risk_level" | "summary" | "title"
>;

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function roundValue(value: number, decimals: number) {
  const precision = 10 ** decimals;
  return Math.round(value * precision) / precision;
}

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Dashboard query failed for ${context}.`);
  }

  return response.data;
}

function isWithinThreshold(
  metricType: MetricType,
  value: number,
  thresholdValue: number | null,
) {
  if (thresholdValue === null) {
    return true;
  }

  if (metricType === "throughput_mbps") {
    return value >= thresholdValue;
  }

  return value <= thresholdValue;
}

function getLatestMetricsByNodeAndType(metrics: MetricRow[]) {
  const latestMetricMap = new Map<string, MetricRow>();

  for (const metric of metrics) {
    const key = `${metric.node_id}:${metric.metric_type}`;

    if (!latestMetricMap.has(key)) {
      latestMetricMap.set(key, metric);
    }
  }

  return Array.from(latestMetricMap.values());
}

function getScoreBand(score: number): "critical" | "stable" | "watch" {
  if (score >= 85) {
    return "stable";
  }

  if (score >= 65) {
    return "watch";
  }

  return "critical";
}

function buildCoreMetrics(latestMetrics: MetricRow[]): DashboardCoreMetric[] {
  return coreMetricOrder.map((metricType) => {
    const rows = latestMetrics.filter((item) => item.metric_type === metricType);
    const values = rows.map((item) => item.metric_value);
    const thresholds = rows
      .map((item) => item.threshold_value)
      .filter((value): value is number => value !== null);

    const complianceCount = rows.filter((item) =>
      isWithinThreshold(metricType, item.metric_value, item.threshold_value),
    ).length;

    const precision = metricType === "packet_loss_pct" ? 2 : 1;

    return {
      compliancePct:
        rows.length > 0 ? Math.round((complianceCount / rows.length) * 100) : 0,
      label: coreMetricConfig[metricType].label,
      metricType,
      nodeSampleSize: rows.length,
      thresholdValue:
        thresholds.length > 0 ? roundValue(average(thresholds), precision) : null,
      unit: rows[0]?.unit ?? coreMetricConfig[metricType].unit,
      value: rows.length > 0 ? roundValue(average(values), precision) : 0,
    };
  });
}

function buildMetricCharts(
  latestMetrics: MetricRow[],
  nodeNameById: Map<string, string>,
): DashboardMetricChart[] {
  return coreMetricOrder.map((metricType) => {
    const rows = latestMetrics
      .filter((item) => item.metric_type === metricType)
      .sort((a, b) => b.metric_value - a.metric_value);
    const thresholds = rows
      .map((item) => item.threshold_value)
      .filter((value): value is number => value !== null);
    const precision =
      metricType === "throughput_mbps"
        ? 0
        : metricType === "packet_loss_pct"
          ? 2
          : 1;
    const maxMetricValue = rows.reduce(
      (maxValue, row) => Math.max(maxValue, row.metric_value),
      0,
    );
    const averageThreshold =
      thresholds.length > 0 ? roundValue(average(thresholds), precision) : null;
    const maxValue =
      averageThreshold !== null
        ? Math.max(maxMetricValue, averageThreshold)
        : maxMetricValue;

    return {
      label: coreMetricConfig[metricType].label,
      maxValue,
      metricType,
      points: rows.map((row) => ({
        nodeName: nodeNameById.get(row.node_id) ?? "Unknown node",
        value: roundValue(row.metric_value, precision),
        withinThreshold: isWithinThreshold(
          metricType,
          row.metric_value,
          row.threshold_value,
        ),
      })),
      thresholdValue: averageThreshold,
      unit: rows[0]?.unit ?? coreMetricConfig[metricType].unit,
    };
  });
}

function createNodeStatusCounts(): Record<NodeStatus, number> {
  return {
    degraded: 0,
    maintenance: 0,
    offline: 0,
    online: 0,
  };
}

function createSeverityCounts(): Record<AlertSeverity, number> {
  return {
    critical: 0,
    info: 0,
    warning: 0,
  };
}

export async function getDashboardOverviewData(): Promise<DashboardOverviewData> {
  const supabase = await createSupabaseServerClient();
  const alertSelect =
    "id,node_id,severity,status,metric_type,current_value,threshold_value,title,triggered_at";

  const [
    nodesResponse,
    metricsResponse,
    openAlertsResponse,
    recentAlertsResponse,
    recentTestsResponse,
    testCasesResponse,
    analysisReportsResponse,
  ] = await Promise.all([
    supabase
      .from("network_nodes")
      .select("id,name,status,availability_pct"),
    supabase
      .from("network_metrics")
      .select("node_id,metric_type,metric_value,threshold_value,unit,recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(500),
    supabase
      .from("network_alerts")
      .select(alertSelect)
      .eq("status", "open")
      .order("triggered_at", { ascending: false })
      .limit(200),
    supabase
      .from("network_alerts")
      .select(alertSelect)
      .order("triggered_at", { ascending: false })
      .limit(5),
    supabase
      .from("test_results")
      .select("id,test_case_id,node_id,status,summary,executed_at")
      .order("executed_at", { ascending: false })
      .limit(5),
    supabase.from("test_cases").select("id,name"),
    supabase
      .from("analysis_reports")
      .select("node_id,title,summary,risk_level,generated_at")
      .order("generated_at", { ascending: false })
      .limit(1),
  ]);

  const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
  const metrics = unwrapQuery<MetricRow[]>(metricsResponse, "metrics");
  const openAlerts = unwrapQuery<AlertRow[]>(openAlertsResponse, "open alerts");
  const recentAlerts = unwrapQuery<AlertRow[]>(recentAlertsResponse, "recent alerts");
  const recentTests = unwrapQuery<TestResultRow[]>(recentTestsResponse, "recent tests");
  const testCases = unwrapQuery<TestCaseRow[]>(testCasesResponse, "test cases");
  const analysisReports = unwrapQuery<AnalysisReportRow[]>(
    analysisReportsResponse,
    "analysis reports",
  );

  const nodeNameById = new Map(nodes.map((node) => [node.id, node.name]));
  const testCaseNameById = new Map(testCases.map((testCase) => [testCase.id, testCase.name]));

  const latestMetrics = getLatestMetricsByNodeAndType(metrics);
  const coreMetrics = buildCoreMetrics(latestMetrics);
  const metricCharts = buildMetricCharts(latestMetrics, nodeNameById);
  const nodeStatusCounts = createNodeStatusCounts();
  const openSeverityCounts = createSeverityCounts();

  for (const node of nodes) {
    nodeStatusCounts[node.status] += 1;
  }

  for (const alert of openAlerts) {
    openSeverityCounts[alert.severity] += 1;
  }

  const availabilityScore = average(nodes.map((node) => node.availability_pct));
  const metricComplianceScore = average(
    coreMetrics.map((metric) => metric.compliancePct),
  );
  const penalty =
    openSeverityCounts.critical * 4 +
    openSeverityCounts.warning * 2 +
    openSeverityCounts.info +
    nodeStatusCounts.offline * 4 +
    nodeStatusCounts.degraded * 2 +
    nodeStatusCounts.maintenance;

  const networkHealthScore = clamp(
    Math.round(availabilityScore * 0.7 + metricComplianceScore * 0.3 - penalty),
    0,
    100,
  );

  const recentTestResults = recentTests.map((test) => ({
    executedAt: test.executed_at,
    id: test.id,
    nodeName: nodeNameById.get(test.node_id) ?? "Unknown node",
    status: test.status,
    summary: test.summary,
    testName: testCaseNameById.get(test.test_case_id) ?? "Unknown test",
  }));

  const latestTestResult = recentTestResults[0] ?? null;
  const latestAnalysis = analysisReports[0];

  return {
    coreMetrics,
    health: {
      activeAlertCount: openAlerts.length,
      networkHealthScore,
      nodeStatusCounts,
      openSeverityCounts,
      scoreBand: getScoreBand(networkHealthScore),
    },
    latestTestResult,
    metricCharts,
    recentAiSummary: latestAnalysis
      ? {
          generatedAt: latestAnalysis.generated_at,
          nodeName: nodeNameById.get(latestAnalysis.node_id) ?? "Unknown node",
          riskLevel: latestAnalysis.risk_level,
          summary: latestAnalysis.summary,
          title: latestAnalysis.title,
        }
      : null,
    recentAlerts: recentAlerts.map((alert) => ({
      currentValue: alert.current_value,
      id: alert.id,
      metricType: alert.metric_type,
      nodeName: nodeNameById.get(alert.node_id) ?? "Unknown node",
      severity: alert.severity,
      status: alert.status,
      thresholdValue: alert.threshold_value,
      title: alert.title,
      triggeredAt: alert.triggered_at,
    })),
    recentTestResults,
  };
}
