import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type TestCaseExecutionRow = Pick<
  Database["public"]["Tables"]["test_cases"]["Row"],
  "id" | "name" | "pass_condition" | "pass_threshold" | "target_metric"
>;

type NodeExecutionRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "id" | "name" | "status"
>;

type MetricExecutionRow = Pick<
  Database["public"]["Tables"]["network_metrics"]["Row"],
  "id" | "metric_value" | "recorded_at"
>;

type TestResultStatus = Database["public"]["Enums"]["test_result_status_enum"];

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

type ExecutePredefinedTestInput = {
  executedAt: string;
  nodeId: string;
  testCaseId: string;
};

type ExecutePredefinedTestSuccess = {
  nodeName: string;
  status: TestResultStatus;
  summary: string;
  testName: string;
};

type ExecutePredefinedTestFailure = {
  errorMessage: string;
};

export type ExecutePredefinedTestResult =
  | { ok: true; value: ExecutePredefinedTestSuccess }
  | { ok: false; value: ExecutePredefinedTestFailure };

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Test runner query failed for ${context}.`);
  }

  return response.data;
}

function formatMetricValue(metricType: string, value: number) {
  if (metricType === "throughput_mbps") {
    return `${value.toFixed(0)} Mbps`;
  }

  if (metricType === "packet_loss_pct") {
    return `${value.toFixed(2)} %`;
  }

  return `${value.toFixed(1)} ms`;
}

export async function executePredefinedTest(
  input: ExecutePredefinedTestInput,
): Promise<ExecutePredefinedTestResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const [testCaseResponse, nodeResponse] = await Promise.all([
      supabase
        .from("test_cases")
        .select("id,name,target_metric,pass_threshold,pass_condition")
        .eq("id", input.testCaseId)
        .limit(1),
      supabase
        .from("network_nodes")
        .select("id,name,status")
        .eq("id", input.nodeId)
        .limit(1),
    ]);

    const testCaseRows = unwrapQuery<TestCaseExecutionRow[]>(
      testCaseResponse,
      "test case",
    );
    const nodeRows = unwrapQuery<NodeExecutionRow[]>(nodeResponse, "node");
    const testCase = testCaseRows[0];
    const node = nodeRows[0];

    if (!testCase || !node) {
      return {
        ok: false,
        value: {
          errorMessage: "Unable to validate selected node or test case.",
        },
      };
    }

    const metricResponse = await supabase
      .from("network_metrics")
      .select("id,metric_value,recorded_at")
      .eq("node_id", node.id)
      .eq("metric_type", testCase.target_metric)
      .order("recorded_at", { ascending: false })
      .limit(1);
    const metricRows = unwrapQuery<MetricExecutionRow[]>(metricResponse, "metric sample");
    const latestMetric = metricRows[0];

    if (!latestMetric) {
      return {
        ok: false,
        value: {
          errorMessage: "No compatible metric sample was found for this node and test.",
        },
      };
    }

    const observedValue = latestMetric.metric_value;
    const thresholdValue = testCase.pass_threshold;
    const isPass =
      testCase.pass_condition === "lte"
        ? observedValue <= thresholdValue
        : observedValue >= thresholdValue;
    const testStatus: TestResultStatus = isPass ? "pass" : "fail";
    const summary = isPass
      ? `${testCase.name} passed on ${node.name}. Observed ${formatMetricValue(testCase.target_metric, observedValue)} against threshold ${formatMetricValue(testCase.target_metric, thresholdValue)}.`
      : `${testCase.name} failed on ${node.name}. Observed ${formatMetricValue(testCase.target_metric, observedValue)} against threshold ${formatMetricValue(testCase.target_metric, thresholdValue)}.`;

    const { error: insertError } = await supabase
      .schema("public")
      .from("test_results")
      .insert({
        details: {
          metric_id: latestMetric.id,
          metric_recorded_at: latestMetric.recorded_at,
          node_status: node.status,
          pass_condition: testCase.pass_condition,
          target_metric: testCase.target_metric,
        },
        executed_at: input.executedAt,
        node_id: node.id,
        observed_value: observedValue,
        status: testStatus,
        summary,
        test_case_id: testCase.id,
        threshold_value: thresholdValue,
      });

    if (insertError) {
      return {
        ok: false,
        value: {
          errorMessage: "Unable to save test execution. Please try again.",
        },
      };
    }

    return {
      ok: true,
      value: {
        nodeName: node.name,
        status: testStatus,
        summary,
        testName: testCase.name,
      },
    };
  } catch {
    return {
      ok: false,
      value: {
        errorMessage: "Something went wrong while running the test.",
      },
    };
  }
}
