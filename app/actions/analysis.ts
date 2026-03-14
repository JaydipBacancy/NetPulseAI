"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalyzeNetworkState } from "@/types/analysis";
import type { Database } from "@/types/supabase";

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "id" | "name" | "network_slice" | "status"
>;

type AlertRow = Pick<
  Database["public"]["Tables"]["network_alerts"]["Row"],
  "current_value" | "id" | "metric_type" | "node_id" | "severity" | "threshold_value" | "title"
>;

type FailedTestRow = Pick<
  Database["public"]["Tables"]["test_results"]["Row"],
  "id" | "node_id" | "summary"
>;

type RiskLevel = Database["public"]["Enums"]["risk_level_enum"];

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

function createActionTimestamp() {
  return new Date().toISOString();
}

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Analysis action query failed for ${context}.`);
  }

  return response.data;
}

function formatMetricType(metricType: AlertRow["metric_type"]) {
  if (metricType === "latency_ms") {
    return "latency";
  }

  if (metricType === "throughput_mbps") {
    return "throughput";
  }

  if (metricType === "packet_loss_pct") {
    return "packet loss";
  }

  return "jitter";
}

function formatMetricValue(metricType: AlertRow["metric_type"], value: number) {
  if (metricType === "throughput_mbps") {
    return `${value.toFixed(0)} Mbps`;
  }

  if (metricType === "packet_loss_pct") {
    return `${value.toFixed(2)} %`;
  }

  return `${value.toFixed(1)} ms`;
}

function deriveRiskLevel(
  node: NodeRow,
  alerts: AlertRow[],
  failedTests: FailedTestRow[],
): RiskLevel {
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;

  if (node.status === "offline" || criticalAlerts >= 2) {
    return "critical";
  }

  if (criticalAlerts >= 1 || failedTests.length >= 2) {
    return "high";
  }

  if (alerts.length > 0 || failedTests.length > 0 || node.status !== "online") {
    return "medium";
  }

  return "low";
}

function deriveLikelyCauses(node: NodeRow, alerts: AlertRow[], failedTests: FailedTestRow[]) {
  const metricTypes = new Set(alerts.map((alert) => alert.metric_type));
  const causes: string[] = [];

  if (metricTypes.has("latency_ms") || metricTypes.has("jitter_ms")) {
    causes.push(
      `Transport path instability near ${node.name} is affecting latency-sensitive traffic on ${node.network_slice}.`,
    );
  }

  if (metricTypes.has("throughput_mbps")) {
    causes.push(
      `Capacity pressure is reducing throughput headroom for ${node.network_slice} workloads.`,
    );
  }

  if (metricTypes.has("packet_loss_pct")) {
    causes.push(
      `Packet discard behavior suggests queue overflow or degraded backhaul around ${node.name}.`,
    );
  }

  if (node.status === "offline") {
    causes.push(
      `${node.name} is offline, so service demand is shifting to adjacent sectors and increasing contention.`,
    );
  }

  if (failedTests.length > 0) {
    causes.push(
      `${failedTests.length} failed predefined tests indicate unresolved quality regressions on this node.`,
    );
  }

  if (causes.length === 0) {
    causes.push(
      `${node.name} appears stable; no active anomalies were detected in current alerts or test outcomes.`,
    );
  }

  return causes.slice(0, 3);
}

function deriveRecommendations(node: NodeRow, riskLevel: RiskLevel, failedTests: FailedTestRow[]) {
  const recommendations: string[] = [
    `Prioritize remediation checks on ${node.name} for the ${node.network_slice} slice.`,
  ];

  if (riskLevel === "critical" || riskLevel === "high") {
    recommendations.push(
      `Escalate to regional operations and keep capacity safeguards active until alert volume drops.`,
    );
  } else {
    recommendations.push(
      `Monitor trend stability over the next telemetry window before closing the incident context.`,
    );
  }

  if (failedTests.length > 0) {
    recommendations.push(
      `Rerun affected predefined tests after corrective actions to verify pass/fail recovery.`,
    );
  } else {
    recommendations.push(`Schedule a proactive test run to validate post-analysis stability.`);
  }

  return recommendations.slice(0, 3);
}

function buildSummary(node: NodeRow, alerts: AlertRow[], failedTests: FailedTestRow[]) {
  const topAlert = alerts[0];

  if (topAlert) {
    return `${node.name} on ${node.network_slice} has ${alerts.length} open alerts. Highest impact is ${topAlert.title} with ${formatMetricValue(topAlert.metric_type, topAlert.current_value)} against threshold ${formatMetricValue(topAlert.metric_type, topAlert.threshold_value)}. ${failedTests.length} recent failed tests reinforce this risk profile.`;
  }

  if (failedTests.length > 0) {
    return `${node.name} on ${node.network_slice} has no open alerts but ${failedTests.length} failed predefined tests, indicating residual instability requiring follow-up validation.`;
  }

  return `${node.name} on ${node.network_slice} is currently stable with no open alerts or failed test pressure in the latest snapshot.`;
}

function buildTitle(node: NodeRow, riskLevel: RiskLevel, alerts: AlertRow[]) {
  if (alerts[0]) {
    return `${node.name}: ${formatMetricType(alerts[0].metric_type)} risk assessment (${riskLevel})`;
  }

  return `${node.name}: operational risk assessment (${riskLevel})`;
}

export async function analyzeNetworkAction(
  _previousState: AnalyzeNetworkState,
): Promise<AnalyzeNetworkState> {
  void _previousState;
  const generatedAt = createActionTimestamp();

  try {
    const supabase = await createSupabaseServerClient();
    const [nodesResponse, alertsResponse, failedTestsResponse] = await Promise.all([
      supabase.from("network_nodes").select("id,name,network_slice,status"),
      supabase
        .from("network_alerts")
        .select("id,node_id,metric_type,severity,title,current_value,threshold_value")
        .eq("status", "open")
        .order("triggered_at", { ascending: false })
        .limit(200),
      supabase
        .from("test_results")
        .select("id,node_id,summary")
        .eq("status", "fail")
        .order("executed_at", { ascending: false })
        .limit(50),
    ]);

    const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
    const openAlerts = unwrapQuery<AlertRow[]>(alertsResponse, "alerts");
    const failedTests = unwrapQuery<FailedTestRow[]>(failedTestsResponse, "failed tests");

    if (nodes.length === 0) {
      return {
        message: "No monitored nodes found. Seed nodes before running analysis.",
        status: "server_error",
        submittedAt: generatedAt,
      };
    }

    const scoreByNode = new Map(nodes.map((node) => [node.id, 0]));

    for (const alert of openAlerts) {
      const severityScore =
        alert.severity === "critical" ? 5 : alert.severity === "warning" ? 3 : 1;
      scoreByNode.set(
        alert.node_id,
        (scoreByNode.get(alert.node_id) ?? 0) + severityScore,
      );
    }

    for (const failedTest of failedTests) {
      scoreByNode.set(
        failedTest.node_id,
        (scoreByNode.get(failedTest.node_id) ?? 0) + 2,
      );
    }

    for (const node of nodes) {
      const statusPenalty =
        node.status === "offline" ? 4 : node.status === "degraded" ? 2 : node.status === "maintenance" ? 1 : 0;
      scoreByNode.set(node.id, (scoreByNode.get(node.id) ?? 0) + statusPenalty);
    }

    const focusNode =
      nodes
        .slice()
        .sort((a, b) => (scoreByNode.get(b.id) ?? 0) - (scoreByNode.get(a.id) ?? 0))[0] ??
      nodes[0];

    const focusAlerts = openAlerts.filter((alert) => alert.node_id === focusNode.id);
    const focusFailedTests = failedTests.filter(
      (failedTest) => failedTest.node_id === focusNode.id,
    );
    const riskLevel = deriveRiskLevel(focusNode, focusAlerts, focusFailedTests);
    const likelyCauses = deriveLikelyCauses(focusNode, focusAlerts, focusFailedTests);
    const recommendations = deriveRecommendations(
      focusNode,
      riskLevel,
      focusFailedTests,
    );
    const summary = buildSummary(focusNode, focusAlerts, focusFailedTests);
    const title = buildTitle(focusNode, riskLevel, focusAlerts);

    const { error: insertError } = await supabase
      .schema("public")
      .from("analysis_reports")
      .insert({
        generated_at: generatedAt,
        likely_causes: likelyCauses,
        network_slice: focusNode.network_slice,
        node_id: focusNode.id,
        recommendations,
        risk_level: riskLevel,
        source_alert_ids: focusAlerts.map((alert) => alert.id),
        summary,
        title,
      });

    if (insertError) {
      return {
        message: "Unable to persist analysis report. Please try again.",
        status: "server_error",
        submittedAt: generatedAt,
      };
    }

    revalidatePath("/analysis");

    return {
      message: `Analysis generated for ${focusNode.name} (${riskLevel.toUpperCase()} risk).`,
      status: "success",
      submittedAt: generatedAt,
    };
  } catch {
    return {
      message: "Something went wrong while generating analysis.",
      status: "server_error",
      submittedAt: generatedAt,
    };
  }
}
